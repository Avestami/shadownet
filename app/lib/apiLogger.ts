// API Logger wrapper
// Used to track and identify excessive API calls

// Store API call timestamps to detect rapid successive calls
const apiCalls: Record<string, number[]> = {};

// Wraps fetch for API calls with logging
export async function loggedFetch(url: string, options?: RequestInit) {
  console.log(`API Call to: ${url}`);
  
  // Track API call frequency
  const now = Date.now();
  if (!apiCalls[url]) {
    apiCalls[url] = [];
  }
  
  // Clean up older calls (older than 10 seconds)
  apiCalls[url] = apiCalls[url].filter(timestamp => now - timestamp < 10000);
  
  // Add current call
  apiCalls[url].push(now);
  
  // Check for rapid successive calls (more than 3 calls in 5 seconds)
  if (apiCalls[url].length > 3) {
    console.warn(`WARNING: Excessive API calls detected to ${url} (${apiCalls[url].length} calls in the last 10 seconds)`);
    console.trace('Call stack for excessive API call');
  }
  
  return fetch(url, options);
}

export default loggedFetch; 