document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const type = contactForm.querySelector('input[name="type"]:checked').value;
  const message = document.getElementById("message").value;

  const subject = encodeURIComponent(`[홈페이지 상담신청] ${name} (${type})`);
  const body = encodeURIComponent(
    `이름: ${name}\n구분: ${type}\n연락처: ${phone}\n\n문의 내용:\n${message}`
  );

  window.location.href = `mailto:jasonkim0210@gmail.com?subject=${subject}&body=${body}`;
});
