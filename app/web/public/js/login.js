const API_BASE = 'http://localhost:8787';
let currentTab = 'login';

window.switchTab = function(tab) {
  currentTab = tab;
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    loginTab.style.borderBottom = '3px solid #2563eb';
    loginTab.style.color = '#2563eb';
    registerTab.style.borderBottom = '3px solid transparent';
    registerTab.style.color = '#6b7280';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    registerTab.style.borderBottom = '3px solid #2563eb';
    registerTab.style.color = '#2563eb';
    loginTab.style.borderBottom = '3px solid transparent';
    loginTab.style.color = '#6b7280';
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  }

  hideError();
}

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

window.handleLogin = async function(e) {
  e.preventDefault();
  hideError();

  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      window.location.href = '/catalog';
    } else {
      showError(data.error || 'Login failed. Please check your credentials.');
    }
  } catch (err) {
    showError('Network error: Unable to connect to server.');
  }
}

window.handleRegister = async function(e) {
  e.preventDefault();
  hideError();

  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;

  if (username.length < 3 || username.length > 24) {
    showError('Username must be between 3 and 24 characters.');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters long.');
    return;
  }

  try {
    const res = await fetch(API_BASE + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      window.location.href = '/catalog';
    } else {
      showError(data.error || 'Registration failed. Username may already be taken.');
    }
  } catch (err) {
    showError('Network error: Unable to connect to server.');
  }
}
