# Google Reviews Setup with Third-Party API

This guide will help you set up automatic Google Reviews fetching using third-party API services.

## Supported Services

### 1. SerpAPI (Recommended) ⭐

**Why SerpAPI?**
- Easy to use
- Direct Google Maps Reviews API
- Reliable and fast
- Good free tier available

**Setup Steps:**
1. Sign up at [serpapi.com](https://serpapi.com/users/sign_up)
2. Get your API key from the dashboard
3. Copy your API key
4. Open `index.html` and find the `GOOGLE_REVIEWS_CONFIG` script
5. Replace `YOUR_SERPAPI_KEY_HERE` with your actual API key
6. Set `apiService: 'serpapi'` (already default)

**Pricing:** Free tier includes 100 searches/month

### 2. ScraperAPI

**Setup Steps:**
1. Sign up at [scraperapi.com](https://www.scraperapi.com/)
2. Get your API key
3. In `index.html`, update the config:
   ```javascript
   apiService: 'scraperapi',
   apiKey: 'YOUR_SCRAPERAPI_KEY_HERE'
   ```

**Pricing:** Free tier includes 1,000 requests/month

### 3. Bright Data

**Setup Steps:**
1. Sign up at [brightdata.com](https://brightdata.com/)
2. Get your API key
3. In `index.html`, update the config:
   ```javascript
   apiService: 'brightdata',
   apiKey: 'YOUR_BRIGHTDATA_KEY_HERE'
   ```

**Pricing:** Contact for pricing

### 4. Custom API

If you have your own API endpoint:

```javascript
apiService: 'custom',
customApiEndpoint: 'https://your-api.com/google-reviews',
apiKey: 'YOUR_API_KEY'
```

## Quick Setup (SerpAPI)

1. **Get API Key:**
   - Visit: https://serpapi.com/users/sign_up
   - Verify your email
   - Copy your API key from the dashboard

2. **Update Configuration:**
   - Open `index.html`
   - Find this section (around line 12):
   ```javascript
   window.GOOGLE_REVIEWS_CONFIG = {
       apiService: 'serpapi',
       apiKey: 'YOUR_SERPAPI_KEY_HERE', // <-- Replace this
       mapsUrl: 'https://www.google.com/maps/place/...',
       businessName: 'A Plus Car Wash and Detailing'
   };
   ```
   - Replace `YOUR_SERPAPI_KEY_HERE` with your actual key

3. **Test:**
   - Open your website
   - Check the browser console (F12) for any errors
   - Reviews should load automatically

## How It Works

1. The page loads and calls `fetchGoogleReviews()`
2. Based on `apiService` setting, it calls the appropriate API
3. Reviews are fetched and filtered to show only 5-star reviews
4. The latest 5 reviews are displayed in the carousel

## Troubleshooting

**Reviews not loading?**
- Check browser console (F12) for errors
- Verify your API key is correct
- Make sure you have API credits/quota remaining
- Check that `apiService` matches the service you're using

**API Errors?**
- Verify your API key is active
- Check your API account for rate limits
- Ensure the Google Maps URL is correct

**Need Help?**
- Check the service's documentation
- Review browser console for specific error messages

## Configuration Options

```javascript
window.GOOGLE_REVIEWS_CONFIG = {
    apiService: 'serpapi',           // Options: 'serpapi', 'scraperapi', 'brightdata', 'custom'
    apiKey: 'YOUR_API_KEY_HERE',     // Your API key from the service
    mapsUrl: 'https://...',          // Your Google Maps URL
    businessName: 'Your Business',   // Business name for search
    customApiEndpoint: null          // Only needed for 'custom' service
};
```

## Notes

- Reviews are automatically filtered to show only 5-star ratings
- Only the latest 5 reviews are displayed
- The carousel auto-advances every 6 seconds
- Reviews refresh each time the page loads
