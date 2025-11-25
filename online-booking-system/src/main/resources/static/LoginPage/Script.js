
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const passwordInput = document.getElementById('password');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

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

    // Validate password
    if (!passwordVal) {
      alert('Password cannot be empty');
      return;
    }

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
          // ✅ Check email domain and redirect accordingly
          if (emailVal.endsWith('@student.tus.ie')) {
            window.location.href = '../Student Dashboard/StudentDashboard.html';
          } else if (emailVal.endsWith('@tus.ie')) {
            window.location.href = '../Admin-Dashboard/index.html';
          }
        }
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Server error. Please try again later.');
    }
  });

  emailInput.addEventListener('input', function () {
    emailError.textContent = '';
  });
});
