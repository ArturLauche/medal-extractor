// Vercel Serverless Function for Medal Video Extractor
// This replaces the Cloudflare Worker with a Vercel-compatible API endpoint

// Simple in-memory cache (for production, consider using Redis or Vercel KV)
const cache = new Map();
let buildCode = 'zjTnnG61Ze5UKZs2YM16f';
let errorCount = 0;

// simple function to get the highest quality video embed
function getHighestQuality(clipData) {
    const types = [1080, 720, 480, 360, 240, 144];
    for (const type of types) {
        if (clipData[`contentUrl${type}p`]) {
            return clipData[`contentUrl${type}p`];
        }
    }
    return clipData.socialMediaVideo;
}

// move route to a function, as I need to recall it if the request fails
async function handleRequest(body) {
    if (!body.url) {
        return {
            success: false,
            error: 'No URL provided',
        };
    }

    // url regex by https://github.com/Cryogenetics
    const urlRegex = /^(https?:\/\/)?medal.tv\/games\/.*\/clips?(\/[\w\d-_]+){1,2}$/;
    const isValid = urlRegex.test(body.url);
    if (!isValid) {
        return {
            success: false,
            error: 'Invalid URL',
        };
    }

    // convert links into format that is used by medal's clip data api
    const url = body.url.replace('medal.tv', `medal.tv/_next/data/${buildCode}/en`).replace("/clip/", "/clips/").replace(/(\?.*)/, "") + ".json";

    // check if url is cached
    if (cache.has(url)) {
        return {
            success: true,
            url: cache.get(url),
        };
    }

    // Create a variable with the Medal URL, and my CORS proxy.
    const newUrl = `https://corsthing.paintbrush.workers.dev/${url}`;
    
    try {
        // fetch the response of the page, and get the HTML
        const response = await fetch(newUrl);
        
        if (response.status === 404) {
            try {
                const data = await response.json();
                if (data.notFound) {
                    return {
                        success: false,
                        error: 'Clip not found',
                    };
                } else throw new Error("Unknown error");
            } catch (e) {
                if (errorCount > 5) {
                    return {
                        success: false,
                        error: 'Medal changed something, please report this to the developer',
                    };
                }
                console.log("attempting to gather new build...");
                
                const textResponse = await fetch("https://medal.tv");
                const text = await textResponse.text();
                const match = text.match(/\/_next\/static\/([\w\d]+)\/_ssgManifest/);
                
                if (match && match[1]) {
                    const newCode = match[1];
                    console.log("new build code:", newCode);
                    buildCode = newCode;
                    errorCount = errorCount + 1;
                    return handleRequest(body);
                } else {
                    throw new Error("Could not extract build code");
                }
            }
        }
        
        const data = await response.json();
        const clipData = data.pageProps.clip;
        
        //fetch the highest quality video embed.
        const directURL = getHighestQuality(clipData) ?? "Couldn't find a video URL";
        
        // send it back to the user
        errorCount = 0;
        //probably a better way to cache this, but it works
        cache.set(url, directURL); // cache the url
        
        return {
            success: true,
            url: directURL
        };
    } catch (err) {
        console.error('Error fetching video:', err);
        return {
            success: false,
            error: 'Failed to fetch video URL',
        };
    }
}

module.exports = async (req, res) => {
    // Handle OPTIONS requests for CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    try {
        let body = {};
        if (req.method === 'POST' && req.headers['content-type']?.includes('application/json')) {
            body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
        }

        const result = await handleRequest(body);

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.status(200).json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};
