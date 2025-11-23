document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const passwordInput = document.getElementById('password');
});

// Email validation on submit
loginForm.addEventListener('submit', function (e) {
  const emailVal = emailInput.value.trim();
  // Email must end with @tus.ie or @tus.student.ie
  const validEmail = /^.+@(tus\.ie|tus\.student\.ie)$/i.test(emailVal);

  if (!validEmail) {
    emailError.textContent = 'Email must end with @tus.ie or @tus.student.ie';
    e.preventDefault();
    return;
  } else {
    emailError.textContent = '';
  }
});

// Clear error when user starts typing
emailInput.addEventListener('input', function () {
  emailError.textContent = '';
});