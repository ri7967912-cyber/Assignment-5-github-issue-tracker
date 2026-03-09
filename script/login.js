document.getElementById('signInBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('issuesTrackerLoggedIn', 'true');
    window.location.href = 'issues.html';
  } else {
    alert('Invalid credentials. Use admin / admin123');
  }
});
if (localStorage.getItem('issuesTrackerLoggedIn') === 'true') {
  window.location.href = 'issues.html';
}