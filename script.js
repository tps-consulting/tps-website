document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const CONTACT_EMAIL = "jasonkim0210@gmail.com";
// Formspree form endpoint (e.g. "https://formspree.io/f/xxxxxxxx"). Empty = not configured yet.
const FORMSPREE_ENDPOINT = "";

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const formWrap = contactForm.closest(".contact-form-wrap");
  const thanksEl = document.getElementById("formThanks");

  const showThanks = () => {
    if (formWrap) formWrap.classList.add("submitted");
    contactForm.hidden = true;
    if (thanksEl) thanksEl.hidden = false;
  };

  const mailtoFallback = (name, phone, type, message) => {
    const subjectText = `[홈페이지 상담신청] ${name} (${type})`;
    const bodyText = `이름: ${name}\n구분: ${type}\n연락처: ${phone}\n\n문의 내용:\n${message}`;
    const fullText = `받는 사람: ${CONTACT_EMAIL}\n제목: ${subjectText}\n\n${bodyText}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.innerHTML =
        `문의 내용이 클립보드에 복사되었습니다.<br>` +
        `이메일 앱이 열리지 않으면 <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>로 ` +
        `직접 붙여넣어 보내주시거나, <a href="tel:02-557-0161">02-557-0161</a>로 전화 주세요.`;
    }

    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const type = contactForm.querySelector('input[name="type"]:checked').value;
    const message = document.getElementById("message").value;

    if (!FORMSPREE_ENDPOINT) {
      mailtoFallback(name, phone, type, message);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });

      if (res.ok) {
        showThanks();
      } else {
        mailtoFallback(name, phone, type, message);
      }
    } catch (err) {
      mailtoFallback(name, phone, type, message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "상담신청 >";
      }
    }
  });
}
