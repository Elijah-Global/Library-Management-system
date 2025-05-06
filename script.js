// DOM references
const heroSection = document.getElementById("table1");
const formSection = document.getElementById("table2");
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const loginErrorContainer = document.getElementById("loginErrorContainer");
const signupErrorContainer = document.getElementById("signupErrorContainer");

// Form input references
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const signupFullName = document.getElementById("fullName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("confirmPassword");

// Navigation and toggle links
const showHome = document.getElementById("showHome");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const showSignupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

function validateName(name) {
  if (name.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: "Name should only contain letters and spaces" };
  }
  if (name !== name.trim()) {
    return { isValid: false, message: "Name should not start or end with spaces" };
  }
  return { isValid: true, message: "" };
}

function showError(input, message) {
  input.classList.add("is-invalid");
  const errorElement = input.nextElementSibling;
  errorElement.textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  const errorElement = input.nextElementSibling;
  errorElement.textContent = "";
}

// Signup form submission
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  const nameResult = validateName(signupFullName.value);
  if (!nameResult.isValid) {
    showError(signupFullName, nameResult.message);
    isValid = false;
  }
  if (!validateEmail(signupEmail.value)) {
    showError(signupEmail, "Please enter a valid email address");
    isValid = false;
  }
  if (!validatePassword(signupPassword.value)) {
    showError(signupPassword, "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number");
    isValid = false;
  }
  if (signupConfirmPassword.value !== signupPassword.value) {
    showError(signupConfirmPassword, "Passwords do not match");
    isValid = false;
  }

  if (isValid) {
    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === signupEmail.value);

    if (userExists) {
      alert("This email is already registered. Please log in.");
      return;
    }

    users.push({
      fullName: signupFullName.value,
      email: signupEmail.value,
      password: signupPassword.value,
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! You can now log in.");
    signupSection.style.display = "none";
    loginSection.style.display = "block";
    this.reset(); // Reset form
  }
});

// Login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  if (!validateEmail(loginEmail.value)) {
    showError(loginEmail, "Please enter a valid email address");
    isValid = false;
  }
  if (!validatePassword(loginPassword.value)) {
    showError(loginPassword, "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number");
    isValid = false;
  }

  if (isValid) {
    const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
    // Validate user credentials
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      user => user.email === loginEmail.value && user.password === loginPassword.value
    );

    if (user) {
      if (loginEmail.value === "elijaholabisi@gmail.com"  && loginPassword.value === "Admin12345") {
        alert("Login successful!");
         // Store the logged-in user in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user)); 
      window.location.href = "/admin.html"; // Redirect to catalog page
      return
      }
      
     
     else {
      alert(`Welcome`)
      localStorage.setItem("loggedInUser", JSON.stringify(user)); 
      window.location.href = "/user.html"; // Redirect to catalog page
      return

    };
  }
  alert("Invalid email or password. Please try again.");
}
});


// Navigation and form toggling
showHome.addEventListener("click", function (e) {
  e.preventDefault();
  heroSection.style.display = "block";
  formSection.style.display = "none";
  loginSection.style.display = "none";
  signupSection.style.display = "none";
});

showLogin.addEventListener("click", function (e) {
  e.preventDefault();
  heroSection.style.display = "none";
  formSection.style.display = "block";
  loginSection.style.display = "block";
  signupSection.style.display = "none";
});

showRegister.addEventListener("click", function (e) {
  e.preventDefault();
  heroSection.style.display = "none";
  formSection.style.display = "block";
  loginSection.style.display = "none";
  signupSection.style.display = "block";
});