(function () {
  "use strict";

  var config = window.FRAMEW_CONFIG || {};
  var has = function (key) {
    return typeof config[key] === "string" && config[key].trim() !== "";
  };
  var get = function (key) {
    return has(key) ? config[key].trim() : "";
  };

  var whatsappDigits = get("whatsappNumber").replace(/\D/g, "");
  if (!whatsappDigits) config.whatsappNumber = "";

  var whatsappLink = function (text) {
    var url = "https://wa.me/" + whatsappDigits;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  };

  /* ---------- Dados configuráveis ---------- */
  function applyConfig() {
    document.querySelectorAll("[data-config-href]").forEach(function (el) {
      var key = el.getAttribute("data-config-href");
      if (has(key)) {
        el.href = get(key);
        el.hidden = false;
      }
    });

    document.querySelectorAll("[data-config-text]").forEach(function (el) {
      var key = el.getAttribute("data-config-text");
      if (has(key)) {
        el.textContent = (el.getAttribute("data-prefix") || "") + get(key).replace(/^@/, "");
        el.hidden = false;
      }
    });

    document.querySelectorAll("[data-config-show]").forEach(function (el) {
      el.hidden = !has(el.getAttribute("data-config-show"));
    });

    document.querySelectorAll("[data-config-fallback]").forEach(function (el) {
      el.hidden = has(el.getAttribute("data-config-fallback"));
    });

    document.querySelectorAll("[data-config-any]").forEach(function (el) {
      el.hidden = !el.getAttribute("data-config-any").split(" ").some(has);
    });

    document.querySelectorAll("[data-config-whatsapp]").forEach(function (el) {
      if (whatsappDigits) {
        el.href = whatsappLink("Olá, Framew! Gostaria de solicitar um orçamento.");
      }
    });

    document.querySelectorAll("[data-config-mailto]").forEach(function (el) {
      if (has("email")) el.href = "mailto:" + get("email");
    });
  }

  /* ---------- Cabeçalho e menu ---------- */
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
    header.classList.toggle("menu-active", open);
    document.body.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Link ativo no menu ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sectionIds = ["inicio", "servicos", "instagram", "contato"];

  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) activeObserver.observe(section);
    });
  }

  /* ---------- Animações de entrada ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    // Elementos irmãos aparecem em sequência
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("reveal");
      });
      el.style.setProperty("--delay", siblings.indexOf(el) * 0.08 + "s");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Brilho dos cards ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    });
  });

  /* ---------- Formulário de contato ---------- */
  var form = document.getElementById("contact-form");
  var pending = document.getElementById("contact-pending");
  var statusBox = document.getElementById("form-status");
  var hint = document.getElementById("form-hint");
  var serviceSelect = document.getElementById("f-service");
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.querySelector(".btn__label");

  // Modo de envio, conforme os canais realmente configurados
  var mode = has("formEndpoint") ? "endpoint" : whatsappDigits ? "whatsapp" : has("email") ? "email" : null;

  if (!mode) {
    form.hidden = true;
    pending.hidden = false;
  } else {
    form.hidden = false;
    if (mode === "whatsapp") {
      submitLabel.textContent = "Enviar pelo WhatsApp";
      hint.textContent = "Sua mensagem será aberta no WhatsApp, pronta para enviar.";
    } else if (mode === "email") {
      submitLabel.textContent = "Enviar por e-mail";
      hint.textContent = "Sua mensagem será aberta no seu aplicativo de e-mail, pronta para enviar.";
    }
  }

  // Botões "Solicitar informações" já selecionam o serviço no formulário
  document.querySelectorAll("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      serviceSelect.value = btn.getAttribute("data-service");
    });
  });

  var validators = {
    nome: function (v) { return v.length >= 2 ? "" : "Informe seu nome."; },
    email: function (v) {
      if (!v) return "Informe seu e-mail.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Informe um e-mail válido.";
    },
    mensagem: function (v) { return v.length >= 10 ? "" : "Escreva uma mensagem com pelo menos 10 caracteres."; },
  };

  function validateField(input) {
    var check = validators[input.name];
    if (!check) return true;
    var message = check(input.value.trim());
    var errorEl = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) input.setAttribute("aria-describedby", errorEl.id);
    else input.removeAttribute("aria-describedby");
    errorEl.textContent = message;
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () { if (input.value) validateField(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  function showStatus(type, message) {
    statusBox.className = "form__status is-" + type;
    statusBox.textContent = message;
    statusBox.hidden = false;
  }

  function composeMessage(data) {
    return [
      "Olá, Framew! Gostaria de solicitar um orçamento.",
      "",
      "Nome: " + data.nome,
      "E-mail: " + data.email,
      data.servico ? "Serviço: " + data.servico : null,
      "",
      data.mensagem,
    ].filter(function (line) { return line !== null; }).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusBox.hidden = true;

    var fields = Object.keys(validators).map(function (n) { return form.elements[n]; });
    var valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      var firstInvalid = fields.find(function (f) { return f.getAttribute("aria-invalid") === "true"; });
      if (firstInvalid) firstInvalid.focus();
      showStatus("error", "Revise os campos destacados e tente novamente.");
      return;
    }

    // Campo anti-spam preenchido: ignora silenciosamente
    if (form.elements._gotcha.value) return;

    var data = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      servico: serviceSelect.value,
      mensagem: form.elements.mensagem.value.trim(),
    };

    if (mode === "whatsapp") {
      var url = whatsappLink(composeMessage(data));
      var win = window.open(url, "_blank");
      if (win) win.opener = null;
      else window.location.href = url; // pop-up bloqueado: abre na mesma aba
      showStatus("success", "Abrimos o WhatsApp com sua mensagem. É só tocar em enviar para concluir.");
      return;
    }

    if (mode === "email") {
      var subject = "Solicitação de orçamento" + (data.servico ? " — " + data.servico : "");
      window.location.href = "mailto:" + get("email") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(composeMessage(data));
      showStatus("success", "Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar para concluir.");
      return;
    }

    submitBtn.disabled = true;
    var originalLabel = submitLabel.textContent;
    submitLabel.textContent = "Enviando…";

    fetch(get("formEndpoint"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
        showStatus("success", "Mensagem enviada com sucesso! Em breve entraremos em contato.");
      })
      .catch(function () {
        var alt = whatsappDigits ? " ou fale conosco pelo WhatsApp" : has("email") ? " ou escreva para " + get("email") : "";
        showStatus("error", "Não foi possível enviar sua mensagem agora. Tente novamente em instantes" + alt + ".");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = originalLabel;
      });
  });

  /* ---------- Inicialização ---------- */
  applyConfig();
  document.getElementById("year").textContent = new Date().getFullYear();
})();
