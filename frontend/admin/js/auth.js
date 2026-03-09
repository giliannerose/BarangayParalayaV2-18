const params = new URLSearchParams(window.location.search);
const urlToken = params.get("token");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  window.history.replaceState({}, document.title, "/admin/dashboard.html");
}

// get stored token
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "/admin-login.html";
}

function getAuthHeaders(){
return{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
}
}

function goHome(){
window.open("../index.html", "_blank");
}

function logout(){
localStorage.removeItem("token")
window.location.href="/admin-login.html"
}