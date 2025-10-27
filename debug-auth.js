// Authentication Flow Test Script
// Run this in browser console to debug the auth issue

console.log('🔍 Starting Authentication Flow Debug...');

// Test 1: Check localStorage token
function testLocalStorage() {
  console.log('\n📱 Test 1: LocalStorage Token Check');
  const token = localStorage.getItem('admin-token');
  
  if (!token) {
    console.error('❌ No token in localStorage');
    return false;
  }
  
  console.log('✅ Token found in localStorage');
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log('Token payload:', {
      username: payload.username,
      isAdmin: payload.isAdmin,
      exp: payload.exp,
      currentTime,
      isExpired: payload.exp < currentTime,
      timeUntilExpiry: payload.exp - currentTime + ' seconds'
    });
    
    if (payload.exp < currentTime) {
      console.error('❌ Token is expired');
      return false;
    }
    
    if (!payload.isAdmin || !payload.username) {
      console.error('❌ Invalid token structure');
      return false;
    }
    
    console.log('✅ Token is valid');
    return true;
  } catch (error) {
    console.error('❌ Error parsing token:', error);
    return false;
  }
}

// Test 2: Check cookies
function testCookies() {
  console.log('\n🍪 Test 2: Cookie Check');
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  console.log('All cookies:', cookies);
  
  if (cookies['admin-token']) {
    console.log('✅ admin-token cookie found');
    return true;
  } else {
    console.error('❌ No admin-token cookie found');
    return false;
  }
}

// Test 3: Test API authentication
async function testAPIAuth() {
  console.log('\n🔗 Test 3: API Authentication Check');
  const token = localStorage.getItem('admin-token');
  
  if (!token) {
    console.error('❌ No token for API test');
    return false;
  }
  
  try {
    const response = await fetch('/api/admin/test-auth', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (response.ok && data.isAuthenticated) {
      console.log('✅ API authentication successful');
      return true;
    } else {
      console.error('❌ API authentication failed');
      return false;
    }
  } catch (error) {
    console.error('❌ API test error:', error);
    return false;
  }
}

// Test 4: Check current route and navigation
function testNavigation() {
  console.log('\n🧭 Test 4: Navigation Check');
  console.log('Current pathname:', window.location.pathname);
  console.log('Current href:', window.location.href);
  
  // Check if we're in an infinite redirect loop
  const navigation = performance.getEntriesByType('navigation')[0];
  console.log('Navigation type:', navigation.type);
  console.log('Page load time:', navigation.loadEventEnd - navigation.navigationStart + 'ms');
}

// Test 5: Monitor authentication state changes
function monitorAuthChanges() {
  console.log('\n👁️ Test 5: Monitoring Authentication Changes');
  
  // Monitor localStorage changes
  let lastToken = localStorage.getItem('admin-token');
  setInterval(() => {
    const currentToken = localStorage.getItem('admin-token');
    if (currentToken !== lastToken) {
      console.log('🔄 Token changed:', {
        old: lastToken ? 'existed' : 'null',
        new: currentToken ? 'exists' : 'null'
      });
      lastToken = currentToken;
    }
  }, 1000);
  
  // Monitor URL changes
  let lastUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      console.log('🔄 URL changed:', {
        from: lastUrl,
        to: window.location.href
      });
      lastUrl = window.location.href;
    }
  }, 500);
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Running All Authentication Tests...\n');
  
  const results = {
    localStorage: testLocalStorage(),
    cookies: testCookies(),
    api: await testAPIAuth(),
  };
  
  testNavigation();
  monitorAuthChanges();
  
  console.log('\n📊 Test Results Summary:');
  console.table(results);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('✅ All tests passed - Authentication should work');
  } else {
    console.error('❌ Some tests failed - Found authentication issues');
  }
  
  return results;
}

// Auto-run the tests
runAllTests();

// Export functions for manual testing
window.authDebug = {
  testLocalStorage,
  testCookies,
  testAPIAuth,
  testNavigation,
  monitorAuthChanges,
  runAllTests
};

console.log('\n💡 You can run individual tests manually:');
console.log('authDebug.testLocalStorage()');
console.log('authDebug.testCookies()');
console.log('authDebug.testAPIAuth()');
console.log('authDebug.runAllTests()');