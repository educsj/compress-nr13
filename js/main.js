/* ============================================================
   COMPRESS — interações da landing page
   ============================================================ */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5531999363507"; // 55 (Brasil) + 31 (DDD) + número

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    // fecha ao clicar em um link
    header.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // validação simples dos campos obrigatórios
      var valid = true;
      ["nome", "telefone"].forEach(function (name) {
        var field = form.elements[name];
        if (!field.value.trim()) {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      if (!valid) {
        form.querySelector(".invalid").focus();
        return;
      }

      var nome     = form.elements["nome"].value.trim();
      var empresa  = form.elements["empresa"].value.trim();
      var telefone = form.elements["telefone"].value.trim();
      var tipo     = form.elements["tipo"].value.trim();
      var mensagem = form.elements["mensagem"].value.trim();

      var linhas = [
        "Olá! Quero uma vistoria de adequação à NR-13.",
        "",
        "*Nome:* " + nome,
      ];
      if (empresa) linhas.push("*Empresa:* " + empresa);
      linhas.push("*Telefone:* " + telefone);
      if (tipo) linhas.push("*Tipo:* " + tipo);
      if (mensagem) linhas.push("*Mensagem:* " + mensagem);

      var texto = encodeURIComponent(linhas.join("\n"));
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + texto;

      window.open(url, "_blank", "noopener");

      /* --------------------------------------------------------
         ALTERNATIVA: enviar por e-mail via Formspree
         --------------------------------------------------------
         Para receber os leads por e-mail em vez de (ou além de)
         abrir o WhatsApp:
         1. Crie uma conta gratuita em https://formspree.io
         2. Pegue seu endpoint (ex.: https://formspree.io/f/abcdwxyz)
         3. No index.html, adicione ao <form>:
              action="https://formspree.io/f/SEU_ID" method="POST"
         4. Comente/remova o e.preventDefault() acima para o envio
            nativo, ou use fetch() aqui para enviar sem sair da página.
      */
    });

    // remove o estado de erro ao digitar
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("invalid")) {
        e.target.classList.remove("invalid");
      }
    });
  }
})();
