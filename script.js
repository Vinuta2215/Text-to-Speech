document.addEventListener('DOMContentLoaded', () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const signupError = document.getElementById('signupError');
  const loginError = document.getElementById('loginError');
  const convertBtn = document.getElementById('convertBtn');
  const text = document.getElementById('textToConvert');
  const errorPara = document.getElementById('errorPara');
  const logoutBtn = document.getElementById('logoutBtn');

  const showAuthContainer = () => {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
  };

  const showAppContainer = () => {
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
  };

  // Show app if user is logged in
  if (loggedInUser) {
    showAppContainer();
  } else {
    showAuthContainer();
  }

  // Sign Up Functionality
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const phone = document.getElementById('signupPhone').value;
    const dateOfBirth = document.getElementById('signupDateOfBirth').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const rePassword = document.getElementById('signupRePassword').value;

    // Validate input fields
    if (!firstName || !lastName || !phone || !dateOfBirth || !email || !password || !rePassword) {
      signupError.textContent = 'Please fill in all required fields.';
      return;
    }

    if (password !== rePassword) {
      signupError.textContent = 'Passwords do not match.';
      return;
    }

    if (users.some(user => user.email === email)) {
      signupError.textContent = 'User already exists.';
      return;
    }

    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    loginForm.reset();
    signupForm.reset();
    showAuthContainer();
  });

  // Log In Functionality
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      showAppContainer();
    } else {
      loginError.textContent = 'Invalid email or password.';
    }
  });

  // Switch between Sign Up and Log In
  document.getElementById('goToLogin').addEventListener('click', () => {
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
  });

  document.getElementById('goToSignup').addEventListener('click', () => {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
  });

  // Text-to-Speech Functionality
  convertBtn.addEventListener('click', function () {
    const speechSynth = window.speechSynthesis;
    const enteredText = text.value;

    if (!speechSynth.speaking && !enteredText.trim().length) {
      errorPara.textContent = 'Nothing to Convert! Enter text in the text area.';
    } else {
      errorPara.textContent = "";
      const newUtter = new SpeechSynthesisUtterance(enteredText);
      speechSynth.speak(newUtter);
      convertBtn.textContent = "Sound is Playing...";
      setTimeout(() => {
        convertBtn.textContent = "Play Converted Sound";
      }, 5000);
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    showAuthContainer();
  });
});