(() => {
  const consentKey = "nycconsult-analytics-consent";
  let choice = null;
  let analyticsLoaded = false;

  try {
    choice = window.localStorage.getItem(consentKey);
  } catch (error) {
    console.error("Could not read analytics consent preference.", error);
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-897151HW5M");

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-897151HW5M";
    document.head.appendChild(script);
  }

  function updateChoice(nextChoice) {
    choice = nextChoice;
    try {
      window.localStorage.setItem(consentKey, nextChoice);
    } catch (error) {
      console.error("Could not save analytics consent preference.", error);
    }

    if (choice === "accepted") {
      if (analyticsLoaded) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied"
        });
      } else {
        loadAnalytics();
      }
    } else if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    banner.hidden = true;
  }

  const banner = document.createElement("section");
  banner.className = "consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-labelledby", "consent-title");
  banner.hidden = true;

  const heading = document.createElement("h2");
  heading.id = "consent-title";
  heading.textContent = "Your privacy choices";
  const message = document.createElement("p");
  message.textContent = "Optional Google Analytics helps us understand site visits. Analytics stays off unless you accept; the site and contact form work either way.";
  const privacyLink = document.createElement("a");
  privacyLink.href = "/privacy.html";
  privacyLink.textContent = "Read the privacy notice";
  const actions = document.createElement("div");
  actions.className = "consent-actions";

  const rejectButton = document.createElement("button");
  rejectButton.type = "button";
  rejectButton.textContent = "Reject analytics";
  rejectButton.addEventListener("click", () => updateChoice("rejected"));
  const acceptButton = document.createElement("button");
  acceptButton.type = "button";
  acceptButton.textContent = "Accept analytics";
  acceptButton.addEventListener("click", () => updateChoice("accepted"));

  actions.append(rejectButton, acceptButton);
  banner.append(heading, message, privacyLink, actions);
  document.body.appendChild(banner);

  const footer = document.querySelector("footer .container, footer .page-container");
  if (footer) {
    if (!footer.querySelector('a[href="/privacy.html"]')) {
      const privacyLinkInFooter = document.createElement("a");
      privacyLinkInFooter.href = "/privacy.html";
      privacyLinkInFooter.textContent = "Privacy notice";
      footer.append(" · ", privacyLinkInFooter);
    }
    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "privacy-settings";
    settingsButton.textContent = "Privacy settings";
    settingsButton.addEventListener("click", () => {
      banner.hidden = false;
      acceptButton.focus();
    });
    footer.append(" · ", settingsButton);
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const calendlyLink = target.closest('a[href^="https://calendly.com/"]');
    if (calendlyLink && choice === "accepted" && typeof window.gtag === "function") {
      window.gtag("event", "calendly_click", { transport_type: "beacon" });
    }
  });

  if (choice === "accepted") {
    loadAnalytics();
  } else if (choice !== "rejected") {
    banner.hidden = false;
  }
})();
