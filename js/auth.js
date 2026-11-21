/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - AUTHENTICATION CONTROLLER
 * Strict flow: Registration First, then Login
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabRegister = document.getElementById('tab-register-btn');
  const tabLogin = document.getElementById('tab-login-btn');
  const formRegister = document.getElementById('form-register');
  const formLogin = document.getElementById('form-login');

  const errorBox = document.getElementById('auth-error-msg');
  const successBox = document.getElementById('auth-success-msg');

  const linkGotoLogin = document.getElementById('link-goto-login');
  const linkGotoRegister = document.getElementById('link-goto-register');

  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  const loginPassword = document.getElementById('login-password');
  const btnAutofillDev = document.getElementById('btn-autofill-dev');

  // Check URL params for pre-selected tab or redirect
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get('tab');
  const redirectUrl = urlParams.get('redirect') || 'index.html';

  if (requestedTab === 'login') {
    showLoginTab();
  } else {
    showRegisterTab();
  }

  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = "❌ " + msg;
      errorBox.style.display = 'block';
      if (successBox) successBox.style.display = 'none';
    }
  }

  function showSuccess(msg) {
    if (successBox) {
      successBox.textContent = "✅ " + msg;
      successBox.style.display = 'block';
      if (errorBox) errorBox.style.display = 'none';
    }
  }

  function clearAlerts() {
    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';
  }

  function showRegisterTab() {
    clearAlerts();
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.style.display = 'block';
    formLogin.style.display = 'none';
  }

  function showLoginTab() {
    clearAlerts();
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
  }

  if (tabRegister) tabRegister.addEventListener('click', showRegisterTab);
  if (tabLogin) tabLogin.addEventListener('click', showLoginTab);
  if (linkGotoLogin) linkGotoLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginTab(); });
  if (linkGotoRegister) linkGotoRegister.addEventListener('click', (e) => { e.preventDefault(); showRegisterTab(); });

  // Toggle Password Visibility
  if (btnTogglePwd && loginPassword) {
    btnTogglePwd.addEventListener('click', () => {
      const isPwd = loginPassword.type === 'password';
      loginPassword.type = isPwd ? 'text' : 'password';
      btnTogglePwd.textContent = isPwd ? '🔒 Hide' : '👁️ Show';
    });
  }

  // Autofill Developer Credentials
  if (btnAutofillDev) {
    btnAutofillDev.addEventListener('click', () => {
      document.getElementById('login-identifier').value = 'developer@siddhivinayakdham.org';
      document.getElementById('login-password').value = 'admin';
      showLoginTab();
      showSuccess("Autofilled Developer credentials. Click 'Login to Account' below.");
    });
  }

  // 1. HANDLE REGISTRATION (Must Register First)
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlerts();

      const name = document.getElementById('reg-name').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const role = document.getElementById('reg-role').value;
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-password-confirm').value;

      if (!name || !phone || !email || !password) {
        showError("All fields marked with an asterisk are required.");
        return;
      }

      if (password !== confirmPassword) {
        showError("Passwords do not match. Please re-enter carefully.");
        return;
      }

      try {
        const newUser = window.TempleDB.registerUser({
          name,
          email,
          phone,
          password,
          role
        });

        // Trigger bells & flower celebration
        if (window.SoundEngine) window.SoundEngine.playTempleBell();
        if (window.flowerShower) window.flowerShower.burst(60);

        // Switch to login tab and prefill identifier
        showLoginTab();
        document.getElementById('login-identifier').value = newUser.email;
        document.getElementById('login-password').focus();
        showSuccess(`Registration successful for ${newUser.name} (${newUser.role})! Now enter your password to login.`);
      } catch (err) {
        showError(err.message || "Registration failed. Please try again.");
      }
    });
  }

  // 2. HANDLE LOGIN
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlerts();

      const identifier = document.getElementById('login-identifier').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        const session = window.TempleDB.loginUser(identifier, password);

        // Trigger bells
        if (window.SoundEngine) window.SoundEngine.playTempleBell();

        showSuccess(`Welcome back, ${session.name}! Redirecting to portal...`);

        // If Developer or Trustee, also grant developer session flag
        if (session.role === 'Developer' || session.role === 'Trustee') {
          sessionStorage.setItem('TEMPLE_DEV_AUTH', 'true');
        }

        setTimeout(() => {
          if (redirectUrl && redirectUrl !== 'auth.html') {
            window.location.href = redirectUrl;
          } else if (session.role === 'Developer') {
            window.location.href = 'developer-dashboard.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1200);

      } catch (err) {
        showError(err.message || "Invalid credentials. Please verify your details or register first.");
      }
    });
  }
});
