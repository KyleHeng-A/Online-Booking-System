const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

// Toggle password visibility (eye stays same size)
togglePassword.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';

  // Replace only the inner path of the icon, not the SVG itself
  eyeIcon.innerHTML = isHidden
    ? `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19
        c-4.477 0-8.268-2.943-9.542-7
        a9.97 9.97 0 013.032-4.568M9.88 9.88
        a3 3 0 104.24 4.24M15 12a3 3 0 00-3-3m0 0
        a3 3 0 013 3m0 0a3 3 0 01-3 3m6.12-4.12
        a9.97 9.97 0 01-3.032 4.568M3 3l18 18" />
    `
    : `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5
        c4.477 0 8.268 2.943 9.542 7
        -1.274 4.057-5.065 7-9.542 7
        -4.477 0-8.268-2.943-9.542-7z" />
    `;
});

// Validate email + password
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const validDomain = email.endsWith('@tus.student.ie') || email.endsWith('@tus.ie');

  if (!email || !password) {
    errorMsg.textContent = 'Please fill in both email and password.';
  } else if (!validDomain) {
    errorMsg.textContent = 'Email must end with @tus.student.ie or @tus.ie';
  } else {
    errorMsg.textContent = '';
    alert('Login successful (example only)');
  }
});
