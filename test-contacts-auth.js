// Test script to check contacts authentication
// Run this in browser console on the admin dashboard page

console.log('=== CONTACTS AUTH TEST ===');

// Test 1: Check if AdminContext is available
if (window.React) {
  console.log('✓ React available');
} else {
  console.log('✗ React not available');
}

// Test 2: Check localStorage for admin token
const adminToken = localStorage.getItem('admin-token');
console.log('Admin token in localStorage:', adminToken ? '✓ Found' : '✗ Not found');

// Test 3: Test manual fetch with proper headers
async function testContactsAPI() {
  const token = localStorage.getItem('admin-token');
  
  if (!token) {
    console.log('✗ No admin token found');
    return;
  }

  console.log('Testing contacts API with Bearer token...');
  
  try {
    const response = await fetch('/api/contacts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Contacts API success:', data);
    } else {
      console.log('✗ Contacts API failed:', await response.text());
    }
  } catch (error) {
    console.log('✗ Contacts API error:', error);
  }
}

// Test 4: Check current page context
console.log('Current page URL:', window.location.href);

// Run the test
testContactsAPI();

console.log('=== END TEST ===');