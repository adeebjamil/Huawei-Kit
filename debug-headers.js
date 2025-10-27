// Debug script to test auth headers
console.log('=== AUTH HEADERS DEBUG ===');

// Check localStorage token
const token = localStorage.getItem('admin-token');
console.log('Token in localStorage:', token ? 'Found ✓' : 'Missing ✗');

if (token) {
  console.log('Token length:', token.length);
  
  // Test manual API call with explicit headers
  console.log('Testing manual API call...');
  
  fetch('/api/contacts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .then(response => {
    console.log('Manual fetch status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Manual fetch result:', data);
  })
  .catch(error => {
    console.error('Manual fetch error:', error);
  });
}

// Check if React context is working
setTimeout(() => {
  const authHeaders = window.getAuthHeaders ? window.getAuthHeaders() : 'Context not available';
  console.log('Context auth headers:', authHeaders);
}, 1000);

console.log('=== END DEBUG ===');