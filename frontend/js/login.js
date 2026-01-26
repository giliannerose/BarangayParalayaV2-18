document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const dashboard = document.getElementById("dashboard");
  const userDisplay = document.getElementById("userDisplay");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginSection = document.getElementById("login-section");

  // Mock user 
  const mockUsers = [
    { username: "admin", password: "12345" },
    { username: "staff", password: "password" }
  ];


  const loggedUser = sessionStorage.getItem("loggedInUser");
  if (loggedUser) {
    showDashboard(JSON.parse(loggedUser));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const validUser = mockUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      sessionStorage.setItem("loggedInUser", JSON.stringify(validUser));
      showDashboard(validUser);
    } else {
      alert("Invalid username or password. Please try again.");
      passwordInput.value = "";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    dashboard.style.display = "none";
    loginSection.style.display = "block";
  });

  function showDashboard(user) {
    loginSection.style.display = "none";
    userDisplay.textContent = user.username;
    dashboard.style.display = "block";
  }
});
