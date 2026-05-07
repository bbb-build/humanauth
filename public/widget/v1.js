/**
 * HumanAuth Widget v1
 * reCAPTCHA-style World ID human verification embed
 * Usage:
 *   <script src="https://humanauth.vercel.app/widget/v1.js"></script>
 *   <div data-humanauth data-app-id="your-app-id"></div>
 */
(function () {
  "use strict";

  var HUMANAUTH_URL = "https://humanauth.vercel.app";
  var POPUP_WIDTH = 520;
  var POPUP_HEIGHT = 680;

  // --- Styles ---

  var BUTTON_STYLES = {
    dark: {
      bg: "#1e2028",
      bgHover: "#282a34",
      border: "#2f323e",
      text: "#ffffff",
      subtext: "#7a8392",
      accent: "#00d4aa",
      shield: "#00d4aa",
    },
    light: {
      bg: "#ffffff",
      bgHover: "#f5f5f5",
      border: "#e0e0e0",
      text: "#111111",
      subtext: "#666666",
      accent: "#00b894",
      shield: "#00b894",
    },
  };

  var SHIELD_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>';

  var CHECK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  // --- Init ---

  function init() {
    var elements = document.querySelectorAll("[data-humanauth]");
    for (var i = 0; i < elements.length; i++) {
      setupWidget(elements[i]);
    }
  }

  function setupWidget(el) {
    if (el._humanauth) return;
    el._humanauth = true;

    var config = {
      appId: el.getAttribute("data-app-id") || "",
      action: el.getAttribute("data-action") || "humanauth-verify",
      theme: el.getAttribute("data-theme") || "dark",
      onSuccess: el.getAttribute("data-on-success") || "",
      onError: el.getAttribute("data-on-error") || "",
      label: el.getAttribute("data-label") || "Verify with World ID",
      size: el.getAttribute("data-size") || "normal",
    };

    if (!config.appId) {
      console.error("[HumanAuth] Missing data-app-id attribute");
      return;
    }

    var state = { verified: false, popup: null };
    var button = createButton(config, state);
    el.appendChild(button);

    window.addEventListener("message", function (e) {
      if (e.origin !== HUMANAUTH_URL) return;
      if (!e.data || !e.data.type) return;

      if (e.data.type === "humanauth:verified") {
        state.verified = true;
        updateButtonVerified(button, config);

        var result = {
          nullifier_hash: e.data.nullifier_hash,
          is_new_user: e.data.is_new_user,
          action: e.data.action,
          verified: true,
        };

        if (config.onSuccess && typeof window[config.onSuccess] === "function") {
          window[config.onSuccess](result);
        }

        el.dispatchEvent(
          new CustomEvent("humanauth:verified", { detail: result, bubbles: true })
        );
      }

      if (e.data.type === "humanauth:error") {
        var error = { error: e.data.error || "Verification failed" };

        if (config.onError && typeof window[config.onError] === "function") {
          window[config.onError](error);
        }

        el.dispatchEvent(
          new CustomEvent("humanauth:error", { detail: error, bubbles: true })
        );
      }
    });
  }

  // --- Button ---

  function createButton(config, state) {
    var s = BUTTON_STYLES[config.theme] || BUTTON_STYLES.dark;
    var btn = document.createElement("button");
    btn.type = "button";

    var compact = config.size === "compact";

    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: compact ? "6px" : "10px",
      padding: compact ? "8px 16px" : "12px 24px",
      fontSize: compact ? "13px" : "15px",
      fontWeight: "600",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: s.text,
      backgroundColor: s.bg,
      border: "1px solid " + s.border,
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      lineHeight: "1",
      whiteSpace: "nowrap",
      WebkitFontSmoothing: "antialiased",
    });

    var icon = document.createElement("span");
    icon.innerHTML = SHIELD_SVG;
    icon.style.color = s.shield;
    icon.style.display = "inline-flex";
    icon.style.flexShrink = "0";

    var label = document.createElement("span");
    label.textContent = config.label;

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener("mouseenter", function () {
      if (!state.verified) btn.style.backgroundColor = s.bgHover;
    });
    btn.addEventListener("mouseleave", function () {
      if (!state.verified) btn.style.backgroundColor = s.bg;
    });

    btn.addEventListener("click", function () {
      if (state.verified) return;
      openPopup(config, state);
    });

    return btn;
  }

  function updateButtonVerified(btn, config) {
    var s = BUTTON_STYLES[config.theme] || BUTTON_STYLES.dark;
    btn.style.cursor = "default";
    btn.style.borderColor = s.accent;
    btn.style.backgroundColor = s.bg;

    var icon = btn.querySelector("span");
    if (icon) {
      icon.innerHTML = CHECK_SVG;
      icon.style.color = "#10b981";
    }

    var label = btn.querySelectorAll("span")[1];
    if (label) {
      label.textContent = "Verified";
      label.style.color = "#10b981";
    }
  }

  // --- Popup ---

  function openPopup(config, state) {
    if (state.popup && !state.popup.closed) {
      state.popup.focus();
      return;
    }

    var url =
      HUMANAUTH_URL +
      "/verify?app_id=" +
      encodeURIComponent(config.appId) +
      "&action=" +
      encodeURIComponent(config.action) +
      "&theme=" +
      encodeURIComponent(config.theme);

    var left = Math.max(0, (screen.width - POPUP_WIDTH) / 2);
    var top = Math.max(0, (screen.height - POPUP_HEIGHT) / 2);

    state.popup = window.open(
      url,
      "humanauth_verify",
      "width=" + POPUP_WIDTH +
        ",height=" + POPUP_HEIGHT +
        ",left=" + left +
        ",top=" + top +
        ",toolbar=no,menubar=no,scrollbars=no,resizable=no"
    );
  }

  // --- Programmatic API ---

  window.HumanAuth = {
    init: init,

    verify: function (options) {
      options = options || {};
      return new Promise(function (resolve, reject) {
        var url =
          HUMANAUTH_URL +
          "/verify?app_id=" +
          encodeURIComponent(options.app_id || "") +
          "&action=" +
          encodeURIComponent(options.action || "humanauth-verify") +
          "&theme=" +
          encodeURIComponent(options.theme || "dark");

        var left = Math.max(0, (screen.width - POPUP_WIDTH) / 2);
        var top = Math.max(0, (screen.height - POPUP_HEIGHT) / 2);

        var popup = window.open(
          url,
          "humanauth_verify",
          "width=" + POPUP_WIDTH +
            ",height=" + POPUP_HEIGHT +
            ",left=" + left +
            ",top=" + top
        );

        function handler(e) {
          if (e.origin !== HUMANAUTH_URL) return;
          if (!e.data || !e.data.type) return;

          if (e.data.type === "humanauth:verified") {
            window.removeEventListener("message", handler);
            resolve({
              nullifier_hash: e.data.nullifier_hash,
              is_new_user: e.data.is_new_user,
              action: e.data.action,
              verified: true,
            });
          }

          if (e.data.type === "humanauth:error") {
            window.removeEventListener("message", handler);
            reject(new Error(e.data.error || "Verification failed"));
          }
        }

        window.addEventListener("message", handler);

        var pollClosed = setInterval(function () {
          if (popup && popup.closed) {
            clearInterval(pollClosed);
            window.removeEventListener("message", handler);
            reject(new Error("Popup closed by user"));
          }
        }, 500);
      });
    },
  };

  // --- Auto-init ---

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
