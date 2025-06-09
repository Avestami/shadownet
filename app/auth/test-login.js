// This is a client-side script to test authentication
// Add this to your login page temporarily for debugging

console.log('=== Authentication Test Script ===');

// Check for cookies
function checkCookies() {
  console.log('Checking cookies:');
  const cookies = document.cookie.split(';').map(c => c.trim());
  console.log('All cookies:', cookies);
  
  // Look for NextAuth cookies
  const authCookies = cookies.filter(c => 
    c.startsWith('next-auth') || 
    c.startsWith('__Secure-next-auth') || 
    c.startsWith('__Host-next-auth')
  );
  
  console.log('Auth cookies found:', authCookies);
  return authCookies.length > 0;
}

// Check session endpoint
async function checkSession() {
  console.log('Checking session endpoint...');
  try {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    console.log('Session data:', data);
    return data?.user != null;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

// Check user endpoint
async function checkUser() {
  console.log('Checking user endpoint...');
  try {
    const res = await fetch('/api/user');
    if (res.ok) {
      const data = await res.json();
      console.log('User data:', data);
      return true;
    } else {
      console.log('User endpoint returned:', res.status);
      return false;
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  const hasCookies = checkCookies();
  const hasSession = await checkSession();
  const hasUser = await checkUser();
  
  console.log('=== Authentication Test Results ===');
  console.log('Has auth cookies:', hasCookies);
  console.log('Has valid session:', hasSession);
  console.log('Has user data:', hasUser);
  
  if (hasCookies && hasSession && hasUser) {
    console.log('✅ Authentication appears to be working correctly');
  } else {
    console.log('❌ Authentication issues detected');
    
    if (!hasCookies) {
      console.log('- No auth cookies found. Check cookie settings and browser privacy settings');
    }
    
    if (!hasSession) {
      console.log('- Session endpoint returned no user. Check NextAuth configuration');
    }
    
    if (!hasUser) {
      console.log('- User endpoint failed. Check API implementation');
    }
  }
}

// Run tests after a short delay
setTimeout(runTests, 2000); 