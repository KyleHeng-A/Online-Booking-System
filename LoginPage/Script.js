
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const passwordInput = document.getElementById('password');

  // Email validation on submit
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value.trim();

    // Validate email format
    const validEmail = /^.+@(tus\.ie|student\.tus\.ie)$/i.test(emailVal);
    if (!validEmail) {
      emailError.textContent = 'Email must end with @tus.ie or @student.tus.ie';
      return;
    } else {
      emailError.textContent = '';
    }

    // Validate password is not empty
    if (!passwordVal) {
      alert('Password cannot be empty');
      return;
    }

    // Send login request to backend
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passwordVal })
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);
        if (result.includes('successful')) {
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        }
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Server error. Please try again later.');
    }
  });

  // Clear error when user starts typing
  emailInput.addEventListener('input', function () {
    emailError.textContent = '';
  });
});
