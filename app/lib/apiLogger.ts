// API Logger wrapper
// Used to track and identify excessive API calls

// Store API call timestamps to detect rapid successive calls
const apiCalls: Record<string, number[]> = {};

// Wraps fetch for API calls with logging
export async function loggedFetch(url: string, options?: RequestInit) {
  // Ensure URL is absolute
  let fullUrl = url;
  
  // If URL is relative and we're in a browser environment, make it absolute
  if (typeof window !== 'undefined' && !url.startsWith('http') && !url.startsWith('//')) {
    const baseUrl = window.location.origin;
    fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  console.log(`API Call to: ${fullUrl}`);
  
  // Track API call frequency
  const now = Date.now();
  if (!apiCalls[fullUrl]) {
    apiCalls[fullUrl] = [];
  }
  
  // Clean up older calls (older than 10 seconds)
  apiCalls[fullUrl] = apiCalls[fullUrl].filter(timestamp => now - timestamp < 10000);
  
  // Add current call
  apiCalls[fullUrl].push(now);
  
  // Check for rapid successive calls (more than 3 calls in 5 seconds)
  if (apiCalls[fullUrl].length > 3) {
    console.warn(`WARNING: Excessive API calls detected to ${fullUrl} (${apiCalls[fullUrl].length} calls in the last 10 seconds)`);
    console.trace('Call stack for excessive API call');
  }
  
  return fetch(fullUrl, options);
}

export default loggedFetch; 