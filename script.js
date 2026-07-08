const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector("#nav-links");
const rfqForm = document.querySelector("#rfq-form");
const formNote = document.querySelector("#form-note");

function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (rfqForm && formNote) {
  rfqForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(rfqForm);
    const lines = [
      "Hello,",
      "",
      "Please help review this custom parts RFQ:",
      "",
      `Process: ${data.get("process")}`,
      `Material: ${data.get("material")}`,
      `Quantity: ${data.get("quantity")}`,
      `Drawing status: ${data.get("drawing")}`,
      "",
      "Project details:",
      String(data.get("message")),
      "",
      "Please reply with DFM questions, quotation assumptions, lead time, and a sample plan.",
    ];

    const subject = encodeURIComponent("Custom Parts RFQ");
    const body = encodeURIComponent(lines.join("\n"));
    formNote.textContent = "RFQ email draft prepared. Your email app should open with the project details.";
    trackEvent("generate_lead", {
      method: "rfq_email_form",
      process: String(data.get("process") || ""),
      drawing_status: String(data.get("drawing") || ""),
    });
    window.location.href = `mailto:info@proteform.com?subject=${subject}&body=${body}`;
  });
}

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("generate_lead", {
      method: "email_click",
      link_text: link.textContent.trim(),
    });
  });
});

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("contact_click", {
      method: "phone_click",
      link_text: link.textContent.trim(),
    });
  });
});
