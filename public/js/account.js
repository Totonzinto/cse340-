function togglePassword() {
  const passwordInput = document.getElementById("account_password")
  const toggleBtn = document.querySelector(".toggle-password")

  if (!passwordInput || !toggleBtn) return

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleBtn.textContent = "🙈"
    toggleBtn.setAttribute("aria-label", "Hide password")
  } else {
    passwordInput.type = "password"
    toggleBtn.textContent = "👁"
    toggleBtn.setAttribute("aria-label", "Show password")
  }
}