// Backend API endpoint for fetching Google Reviews
// This file should be deployed to a server/serverless function
// Example for Vercel, Netlify Functions, or Node.js server

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { placeId, coordinates } = JSON.parse(event.body || '{}');
        
        // Replace with your Google Places API key
        const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';
        
        // Fetch place details including reviews
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.reviews) {
            // Filter for 5-star reviews and return latest 5
            const fiveStarReviews = data.result.reviews
                .filter(review => review.rating === 5)
                .slice(0, 5)
                .map(review => ({
                    author: review.author_name,
                    rating: review.rating,
                    text: review.text,
                    time: review.time,
                    relativeTime: formatRelativeTime(review.time),
                    profilePhoto: review.profile_photo_url
                }));
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reviews: fiveStarReviews })
            };
        }
        
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch reviews' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

function formatRelativeTime(timestamp) {
    const seconds = Math.floor((Date.now() / 1000 - timestamp));
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
    return `${Math.floor(seconds / 31536000)} years ago`;
}

