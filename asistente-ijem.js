/* =====================================================================
   Asistente virtual del IJEM — fragmento integrable (v17)
   ---------------------------------------------------------------------
   Para incorporarlo a cualquier página del sitio oficial, el gestor
   solo pega esta línea antes de </body>:

     <script src="https://mago-del-caos.github.io/IJEM-prueba/asistente-ijem.js" defer></script>

   No requiere cambios en el servidor ni librerías. El asistente habla
   con el mismo cerebro que atienden WhatsApp y Facebook del instituto
   (registro de interesados, preguntas frecuentes, IA con la base
   oficial y canalización a una persona cuando hace falta).
   El dominio de la página debe estar en la lista de orígenes
   permitidos del servidor (juventud.edu.mx ya está incluido).
   ===================================================================== */
(function () {
  "use strict";
  if (window.__asistenteIJEM) return;
  window.__asistenteIJEM = true;

  var ENDPOINT = "https://ak.aracknia.com/chat";
  var NAVY = "#1d2b4d", RED = "#e2231a", YELLOW = "#ffd100", INK = "#333333", LINE = "#e2e2e2";

  var css = [
    ".aijem-fab{position:fixed;right:22px;bottom:22px;z-index:1200;width:62px;height:62px;border-radius:50%;border:0;cursor:pointer;background:" + NAVY + ";color:#fff;box-shadow:0 10px 26px rgba(19,30,56,.4);display:flex;align-items:center;justify-content:center;transition:transform .15s ease,background .15s ease}",
    ".aijem-fab:hover{transform:scale(1.06);background:" + RED + "}",
    ".aijem-fab svg{width:30px;height:30px;fill:#fff}",
    ".aijem-fab .aijem-dot{position:absolute;top:-2px;right:-2px;width:22px;height:22px;border-radius:50%;background:" + RED + ";color:#fff;font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:Arial,sans-serif}",
    ".aijem-fab.opened .aijem-dot{display:none}",
    ".aijem-panel{position:fixed;right:22px;bottom:96px;z-index:1199;width:min(384px,calc(100vw - 32px));height:min(608px,calc(100dvh - 122px));background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(19,30,56,.42);display:flex;flex-direction:column;opacity:0;visibility:hidden;transform:translateY(16px) scale(.98);transform-origin:bottom right;transition:opacity .22s ease,transform .22s ease,visibility .22s;font-family:Arial,sans-serif}",
    ".aijem-panel.open{opacity:1;visibility:visible;transform:none}",
    ".aijem-head{background:linear-gradient(120deg," + NAVY + " 0%,#27406e 100%);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;flex:0 0 auto}",
    ".aijem-avatar{width:42px;height:42px;border-radius:50%;flex:0 0 42px;background:" + YELLOW + ";color:" + NAVY + ";display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem}",
    ".aijem-head h3{color:#fff;font-size:1rem;margin:0;line-height:1.2;font-family:Arial,sans-serif}",
    ".aijem-head small{display:block;color:#bcd0ea;font-size:.76rem}",
    ".aijem-close{margin-left:auto;background:transparent;border:0;color:#fff;cursor:pointer;width:36px;height:36px;border-radius:50%;font-size:1.3rem;line-height:1;display:flex;align-items:center;justify-content:center}",
    ".aijem-close:hover{background:rgba(255,255,255,.16)}",
    ".aijem-chips{flex:0 0 auto;display:flex;gap:8px;padding:10px 12px;overflow-x:auto;background:#eef3f8;border-bottom:1px solid " + LINE + ";scrollbar-width:thin}",
    ".aijem-chip{flex:0 0 auto;background:#fff;color:" + NAVY + ";border:1px solid #c3d2e0;border-radius:999px;padding:7px 13px;font-size:.83rem;cursor:pointer;white-space:nowrap;font-family:Arial,sans-serif}",
    ".aijem-chip:hover{border-color:" + RED + ";color:" + RED + "}",
    ".aijem-log{flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;background:#f7fafc}",
    ".aijem-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:.93rem;white-space:pre-wrap;line-height:1.5}",
    ".aijem-msg.bot{background:#e9f0f7;color:" + INK + ";align-self:flex-start;border-bottom-left-radius:4px}",
    ".aijem-msg.user{background:" + NAVY + ";color:#fff;align-self:flex-end;border-bottom-right-radius:4px}",
    ".aijem-form{display:flex;gap:8px;padding:12px;border-top:1px solid " + LINE + ";background:#fff;flex:0 0 auto}",
    ".aijem-form input{flex:1;padding:11px 12px;border:1px solid " + LINE + ";border-radius:8px;font-size:.95rem;min-width:0;font-family:Arial,sans-serif}",
    ".aijem-form button{background:" + RED + ";color:#fff;border:0;border-radius:8px;padding:11px 16px;font-weight:700;cursor:pointer;font-size:.93rem}",
    "@media (max-width:600px){.aijem-panel{right:16px;bottom:90px}.aijem-fab{right:16px;bottom:16px}.aijem-msg{max-width:92%}}"
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var fab = document.createElement("button");
  fab.className = "aijem-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Abrir el asistente virtual");
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.02 2 11c0 2.9 1.55 5.48 3.96 7.13-.16 1.1-.62 2.42-1.4 3.37 0 0 2.9.2 4.9-1.17.8.2 1.65.3 2.54.3 5.52 0 10-4.02 10-9S17.52 2 12 2zm-3.2 10.6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.2 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.2 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg><span class="aijem-dot" aria-hidden="true">1</span>';
  document.body.appendChild(fab);

  var panel = document.createElement("div");
  panel.className = "aijem-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente virtual del IJEM");
  panel.innerHTML =
    '<div class="aijem-head"><span class="aijem-avatar" aria-hidden="true">IJEM</span>' +
    "<div><h3>Asistente del IJEM</h3><small>En línea · Responde desde la base oficial del instituto</small></div>" +
    '<button class="aijem-close" type="button" aria-label="Cerrar el asistente">×</button></div>' +
    '<div class="aijem-chips" aria-label="Preguntas frecuentes">' +
    '<button class="aijem-chip" type="button" data-q="¿Qué niveles tiene el IJEM?">¿Qué niveles tiene el IJEM?</button>' +
    '<button class="aijem-chip" type="button" data-q="¿Cuánto cuesta la colegiatura?">¿Cuánto cuesta la colegiatura?</button>' +
    '<button class="aijem-chip" type="button" data-q="¿Cuándo son las inscripciones?">¿Cuándo son las inscripciones?</button>' +
    '<button class="aijem-chip" type="button" data-q="¿Qué es Ag Lucem?">¿Qué es Ag Lucem?</button>' +
    '<button class="aijem-chip" type="button" data-q="Quiero inscribir a mi hijo">Quiero inscribir a mi hijo/a</button>' +
    "</div>" +
    '<div class="aijem-log" aria-live="polite"></div>' +
    '<form class="aijem-form"><input type="text" placeholder="Escribe tu pregunta…" autocomplete="off" aria-label="Escribe tu pregunta"><button type="submit">Enviar</button></form>';
  document.body.appendChild(panel);

  var log = panel.querySelector(".aijem-log");
  var form = panel.querySelector(".aijem-form");
  var input = panel.querySelector("input");
  var closeBtn = panel.querySelector(".aijem-close");
  var isOpen = false;

  function addMsg(text, who) {
    var div = document.createElement("div");
    div.className = "aijem-msg " + who;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  addMsg("Escríbeme tu pregunta o toca una de las opciones de arriba: te respondo con la información del instituto y, si quieres, tomo tus datos para que te contacten.", "bot");

  function setOpen(open) {
    isOpen = open;
    panel.classList.toggle("open", open);
    fab.classList.toggle("opened", open);
    fab.setAttribute("aria-label", open ? "Cerrar el asistente virtual" : "Abrir el asistente virtual");
    if (open && window.innerWidth > 600) {
      window.setTimeout(function () { input.focus(); }, 260);
    }
  }
  fab.addEventListener("click", function () { setOpen(!isOpen); });
  closeBtn.addEventListener("click", function () { setOpen(false); fab.focus(); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && isOpen) setOpen(false);
  });

  var sesion = null;
  try {
    sesion = window.localStorage.getItem("ijem_chat_sesion");
    if (!sesion) {
      sesion = "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      window.localStorage.setItem("ijem_chat_sesion", sesion);
    }
  } catch (e) {
    sesion = "w" + Date.now().toString(36);
  }

  var enviando = false;
  function enviar(text) {
    if (enviando) return;
    enviando = true;
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sesion: sesion, texto: text })
    }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (d) {
      enviando = false;
      var rs = (d && d.respuestas) || [];
      if (!rs.length) {
        addMsg("Perdón, no pude procesar tu mensaje. ¿Me lo repites?", "bot");
        return;
      }
      rs.forEach(function (r2, i) {
        window.setTimeout(function () { addMsg(r2, "bot"); }, 220 * (i + 1));
      });
    }).catch(function () {
      enviando = false;
      addMsg("Hubo un problema de conexión. Inténtalo de nuevo en un momento, por favor.", "bot");
    });
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    enviar(text);
  });

  var chips = panel.querySelectorAll(".aijem-chip");
  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      var q = this.getAttribute("data-q");
      addMsg(q, "user");
      enviar(q);
    });
  }
})();
