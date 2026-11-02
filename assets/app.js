/*
 * Professorium – Klick-Prototyp
 * Router, Seiten, Suche und Formulare. Inhalte kommen aus config.js und profiles.js.
 */
(function () {
  "use strict";

  var SITE = window.SITE;
  var PROFILES = window.PROFILES;
  var FACH = window.FACHGEBIETE;
  var THEMEN = window.AKTUELLE_THEMEN;
  var FORMATE = window.FORMATE;

  var app = document.getElementById("app");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uid = 0;
  var cleanup = [];

  /* ---------------- Hilfsfunktionen ---------------- */

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fachLabel(key) {
    for (var i = 0; i < FACH.length; i++) if (FACH[i].key === key) return FACH[i].label;
    return key;
  }
  function fullName(p) { return p.titel + " " + p.vorname + " " + p.nachname; }
  function initials(p) { return p.vorname.charAt(0) + p.nachname.charAt(0); }
  function countByFach(key) { return PROFILES.filter(function (p) { return p.fach === key; }).length; }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function byKeys(list) { return list.slice().sort(function (a, b) { return a.localeCompare(b, "de"); }); }
  function unique(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }

  function statusBadge(p) {
    if (p.status === "emeritiert") return '<span class="tag tag-outline">emeritiert</span>';
    if (p.status === "honorar") return '<span class="tag tag-outline">Honorarprofessur</span>';
    return "";
  }

  function portrait(p, size) {
    if (p.foto) {
      return '<div class="portrait portrait--' + size + ' has-photo">' +
        '<img src="' + esc(p.foto) + '" alt="Porträt von ' + esc(fullName(p)) + ' (Symbolfoto)" loading="' + (size === "lg" ? "eager" : "lazy") + '" decoding="async">' +
        '<span aria-hidden="true">' + esc(initials(p)) + "</span>" +
        (size === "lg" ? '<small aria-hidden="true">Symbolfoto</small>' : "") +
        "</div>";
    }
    return '<div class="portrait portrait--' + size + '" role="img" aria-label="Porträt-Platzhalter für ' + esc(fullName(p)) + '">' +
      '<span aria-hidden="true">' + esc(initials(p)) + "</span>" +
      (size === "lg" ? '<small aria-hidden="true">Foto folgt</small>' : "") +
      "</div>";
  }

  // Fehlt eine Bilddatei, zeigt das Porträt automatisch wieder die Initialen.
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG" || !img.parentNode || !img.parentNode.classList.contains("portrait")) return;
    var box = img.parentNode;
    box.classList.remove("has-photo");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.alt.replace(/^Porträt von /, "Porträt-Platzhalter für ").replace(/ \(Symbolfoto\)$/, ""));
    var cap = box.querySelector("small");
    if (cap) cap.textContent = "Foto folgt";
    img.remove();
  }, true);

  function sealSvg(cls) {
    var id = "seal-path-" + (++uid);
    return '<svg class="' + cls + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<defs><path id="' + id + '" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"/></defs>' +
      '<circle cx="50" cy="50" r="48.5" class="seal-bg"/>' +
      '<circle cx="50" cy="50" r="47" class="seal-ring"/>' +
      '<circle cx="50" cy="50" r="28" class="seal-ring"/>' +
      '<text class="seal-text"><textPath href="#' + id + '" textLength="228" lengthAdjust="spacing">GEPRÜFTES PROFIL · ' + esc(SITE.name.toUpperCase()) + ' ·</textPath></text>' +
      '<path class="seal-check" d="M39 51 l8 8 l15 -17"/>' +
      "</svg>";
  }

  function sealButton(p) {
    var pid = "seal-pop-" + (++uid);
    return '<span class="seal-wrap">' +
      '<button type="button" class="seal-btn" aria-expanded="false" aria-controls="' + pid + '">' + sealSvg("seal-small") + "Geprüftes Profil</button>" +
      '<span class="seal-pop" id="' + pid + '" role="tooltip"><strong>Was heißt „Geprüftes Profil“?</strong>' +
      "Die Redaktion hat Professur, Lebenslauf und Vortragserfahrung geprüft. Das Profil wird einmal im Jahr erneut geprüft. Letzte Prüfung: " + esc(p.geprueft) + ".</span>" +
      "</span>";
  }

  function card(p, level) {
    var h = "h" + (level || 3);
    return '<a class="card" href="#profil-' + esc(p.slug) + '">' +
      '<div class="card-head">' + portrait(p, "sm") +
      '<div class="card-id"><' + h + ' class="card-name"><span class="t">' + esc(p.titel) + "</span>" + esc(p.vorname + " " + p.nachname) + "</" + h + ">" +
      '<p class="card-prof">' + esc(p.professur) + "</p></div></div>" +
      '<p class="card-inst">' + esc(p.institution) + " · " + esc(p.ort) + "</p>" +
      '<ul class="card-topics">' + p.themen.slice(0, 2).map(function (t) { return "<li>" + esc(t.titel) + "</li>"; }).join("") + "</ul>" +
      '<div class="card-foot"><span class="tag">' + esc(fachLabel(p.fach)) + "</span>" + statusBadge(p) +
      '<span class="card-more" aria-hidden="true">Profil ansehen →</span></div>' +
      "</a>";
  }

  function mini(p) {
    return '<a class="mini" href="#profil-' + esc(p.slug) + '">' + portrait(p, "xs") +
      '<span class="mini-text"><span class="mini-name">' + esc(p.titel + " " + p.vorname + " " + p.nachname) + "</span>" +
      '<span class="mini-meta">' + esc(fachLabel(p.fach)) + " · " + esc(p.ort) + "</span>" +
      '<span class="mini-meta">' + esc(p.themen[0].titel) + "</span></span>" +
      '<span class="mini-arrow" aria-hidden="true">→</span></a>';
  }

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------------- Suche ---------------- */

  var state = { q: "", fach: "", format: "", region: "", sprache: "", modus: "" };

  function resetFilters() { state.fach = ""; state.format = ""; state.region = ""; state.sprache = ""; state.modus = ""; }

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");
  }
  function words(s) { return norm(s).split(/[^a-z0-9]+/).filter(Boolean); }

  var STOP = {};
  ("der die das den dem des ein eine einen einem einer eines und oder in im ins am an auf aus bei mit zu zum zur fur fuer uber ueber von vom vor nach als wie was wer wo " +
    "jemand jemanden jemandem ich wir sie er es man brauche brauchen suche suchen sucht gesucht moechte mochte bitte etwa ca min minute minuten stunde stunden " +
    "spricht sprechen redet reden vortrag vortrage vortragen vortraege redner rednerin referent referentin thema themen zu prof professor professorin dr").split(" ")
    .forEach(function (w) { STOP[norm(w)] = true; });

  function queryTokens(q) {
    return unique(words(q).filter(function (t) {
      if (STOP[t]) return false;
      if (/^\d+$/.test(t) && t.length < 4) return false;
      return true;
    }));
  }

  var INDEX = PROFILES.map(function (p) {
    var high = [p.vorname, p.nachname, fachLabel(p.fach), p.professur, p.ort, p.region, p.land]
      .concat(p.stichworte).concat(p.themen.map(function (t) { return t.titel; })).join(" ");
    var low = [p.kurzbio, p.institution].concat(p.themen.map(function (t) { return t.text; })).join(" ");
    return { p: p, high: words(high), low: words(low) };
  });

  function tokenIn(token, list) {
    for (var i = 0; i < list.length; i++) {
      if (token.length <= 2 ? list[i] === token : list[i].indexOf(token) === 0) return true;
    }
    return false;
  }

  function search() {
    var tokens = queryTokens(state.q);
    var out = [];
    INDEX.forEach(function (entry) {
      var p = entry.p;
      if (state.fach && p.fach !== state.fach) return;
      if (state.format && p.formate.indexOf(state.format) === -1) return;
      if (state.region && p.region !== state.region) return;
      if (state.sprache && p.sprachen.indexOf(state.sprache) === -1) return;
      if (state.modus && p.modus.indexOf(state.modus) === -1) return;
      var score = 0, hits = 0;
      tokens.forEach(function (t) {
        var inHigh = tokenIn(t, entry.high), inLow = tokenIn(t, entry.low);
        if (inHigh || inLow) { hits++; score += inHigh ? 3 : 1; }
      });
      if (tokens.length && !hits) return;
      out.push({ p: p, hits: hits, score: score });
    });
    out.sort(function (a, b) {
      return (b.hits - a.hits) || (b.score - a.score) || ((b.p.vorzeige ? 1 : 0) - (a.p.vorzeige ? 1 : 0));
    });
    return { list: out.map(function (r) { return r.p; }), tokens: tokens };
  }

  function activeFilterCount() {
    return ["fach", "format", "region", "sprache", "modus"].filter(function (k) { return state[k]; }).length;
  }

  /* ---------------- Formulare ---------------- */

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldHtml(f) {
    var id = f.id;
    var req = f.required ? ' data-required aria-required="true"' : "";
    var msg = f.required ? ' data-msg="' + esc(f.msg) + '"' : "";
    var describedBy = ' aria-describedby="' + id + "-error" + (f.hint ? " " + id + "-hint" : "") + '"';
    var control;
    if (f.type === "select") {
      control = '<select id="' + id + '" name="' + id + '"' + req + msg + describedBy + ">" +
        f.options.map(function (o) { return '<option value="' + esc(o.value) + '">' + esc(o.label) + "</option>"; }).join("") + "</select>";
    } else if (f.type === "textarea") {
      control = '<textarea id="' + id + '" name="' + id + '" rows="5"' + req + msg + describedBy + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") + "></textarea>";
    } else {
      control = '<input id="' + id + '" name="' + id + '" type="' + (f.type || "text") + '"' + req + msg + describedBy +
        (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : "") +
        (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") + ">";
    }
    return '<div class="field' + (f.wide ? " field--wide" : "") + '">' +
      '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <span class="req" aria-hidden="true">*</span>' : "") + "</label>" +
      (f.hint ? '<p class="field-hint" id="' + id + '-hint">' + esc(f.hint) + "</p>" : "") +
      control +
      '<p class="field-error" id="' + id + '-error" hidden></p></div>';
  }

  function setError(control, message) {
    var err = control.closest(".field").querySelector(".field-error");
    if (message) {
      control.setAttribute("aria-invalid", "true");
      err.textContent = message;
      err.hidden = false;
    } else {
      control.removeAttribute("aria-invalid");
      err.textContent = "";
      err.hidden = true;
    }
  }

  function checkControl(control) {
    var v = control.value.trim();
    if (control.hasAttribute("data-required") && !v) return control.getAttribute("data-msg");
    if (control.type === "email" && v && !EMAIL.test(v)) return "Bitte geben Sie eine gültige E-Mail-Adresse an, zum Beispiel name@beispiel.de.";
    return "";
  }

  function attachForm(form, confirmHtml) {
    var tried = false;
    var alertBox = form.querySelector(".form-alert");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tried = true;
      var first = null, count = 0;
      form.querySelectorAll("input, select, textarea").forEach(function (c) {
        var m = checkControl(c);
        setError(c, m);
        if (m) { count++; if (!first) first = c; }
      });
      if (first) {
        alertBox.textContent = count === 1
          ? "Bitte prüfen Sie das markierte Feld."
          : "Bitte prüfen Sie die " + count + " markierten Felder.";
        alertBox.hidden = false;
        first.focus();
        return;
      }
      alertBox.hidden = true;
      var holder = form.parentNode;
      var original = form;
      var box = document.createElement("div");
      box.className = "confirm";
      box.setAttribute("role", "status");
      box.setAttribute("tabindex", "-1");
      box.innerHTML = '<span class="confirm-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        confirmHtml +
        '<p class="demo">Hinweis: Dies ist ein Prototyp. Es wurde nichts versendet.</p>' +
        '<button type="button" class="btn btn-secondary">Weitere Anfrage stellen</button>';
      holder.replaceChild(box, original);
      box.focus();
      box.querySelector("button").addEventListener("click", function () {
        original.reset();
        original.querySelectorAll("input, select, textarea").forEach(function (c) { setError(c, ""); });
        tried = false;
        holder.replaceChild(original, box);
        var firstField = original.querySelector("input, select, textarea");
        if (firstField) firstField.focus();
      });
    });
    form.addEventListener("input", function (e) {
      if (!tried) return;
      var c = e.target;
      if (c.matches("input, select, textarea")) setError(c, checkControl(c));
    });
    form.addEventListener("change", function (e) {
      if (!tried) return;
      var c = e.target;
      if (c.matches("select")) setError(c, checkControl(c));
    });
  }

  function formShell(id, fields, submitLabel, note) {
    return '<form id="' + id + '" class="form-grid" novalidate>' +
      fields.map(fieldHtml).join("") +
      '<p class="form-alert" role="alert" hidden></p>' +
      '<div class="form-actions"><button type="submit" class="btn btn-primary">' + esc(submitLabel) + "</button>" +
      '<span class="muted">' + note + "</span></div>" +
      "</form>";
  }

  /* ---------------- Rahmen ---------------- */

  function renderShell() {
    document.documentElement.lang = "de";
    document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#main" data-skip>Zum Inhalt springen</a>');
    app.innerHTML =
      '<div class="proto-bar"><div class="wrap">Prototyp · Alle Profile sind fiktive Beispiele</div></div>' +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="#start" aria-label="' + esc(SITE.name) + ', zur Startseite"><span class="brand-name">' + esc(SITE.name) + '<span class="brand-dot">.</span></span><span class="brand-domain">' + esc(SITE.domain) + "</span></a>" +
      '<nav class="site-nav" aria-label="Hauptnavigation"><ul>' +
      '<li><a href="#suche" data-nav="suche"><span class="nav-long">Köpfe finden</span><span class="nav-short">Suche</span></a></li>' +
      '<li><a href="#fuer-professoren" data-nav="fuer-professoren">Für Professoren</a></li>' +
      "</ul></nav></div></header>" +
      '<main id="main" tabindex="-1"></main>' +
      '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-brand"><span class="brand-name">' + esc(SITE.name) + '<span class="brand-dot">.</span></span>' +
      "<p>Ausgewählte Professorinnen und Professoren für Vorträge, Beratung und Medien. Kuratiert und persönlich vermittelt.</p></div>" +
      '<div class="footer-col"><h2>Portal</h2><ul>' +
      '<li><a href="#suche">Köpfe finden</a></li>' +
      '<li><a href="#fuer-professoren">Für Professoren</a></li>' +
      '<li><a href="#impressum">Impressum</a></li>' +
      '<li><a href="#datenschutz">Datenschutz</a></li>' +
      "</ul></div>" +
      '<div class="footer-col"><h2>Kontakt</h2><p>Schreiben Sie uns:<br><span class="mono">' + esc(SITE.kontaktEmail) + "</span></p>" +
      "<p>Wir antworten innerhalb von " + esc(SITE.antwortzeit) + ".</p></div>" +
      '<p class="footer-legal">© 2026 ' + esc(SITE.name) + " · Prototyp. Alle Profile sind fiktive Beispiele, Ähnlichkeiten mit realen Personen sind nicht beabsichtigt.</p>" +
      "</div></footer>" +
      '<div class="mobilebar" id="mobilebar" hidden></div>';
  }

  function setNav(key) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === key) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function setTitle(t) { document.title = t ? t + " · " + SITE.name : SITE.name + " · " + SITE.claim; }

  function main() { return document.getElementById("main"); }

  /* ---------------- Seiten ---------------- */

  function pageHome() {
    setNav("");
    setTitle("");
    var featured = PROFILES.filter(function (p) { return p.hervorgehoben; }).slice(0, 4);
    var others = PROFILES.filter(function (p) { return !p.hervorgehoben; }).slice(0, 4);
    main().innerHTML =
      '<section class="hero"><div class="wrap hero-grid">' +
      '<div class="hero-copy">' +
      '<p class="eyebrow">Für Veranstaltungen, Unternehmen und Medien</p>' +
      "<h1>" + esc(SITE.claim) + "</h1>" +
      '<p class="lead">Finden Sie geprüfte Professorinnen und Professoren für Vortrag, Podium, Beratung oder Interview. Wir vermitteln persönlich und antworten innerhalb von ' + esc(SITE.antwortzeit) + ".</p>" +
      '<form class="searchform" role="search" id="home-search">' +
      '<div class="input-wrap"><label class="visually-hidden" for="home-q">Thema oder Name</label>' +
      '<input id="home-q" type="search" placeholder="Thema oder Name" autocomplete="off" enterkeyhint="search"></div>' +
      '<button class="btn btn-primary" type="submit">Suchen</button></form>' +
      '<div class="hero-chips"><span class="label">Gefragt:</span><ul class="chips">' +
      THEMEN.slice(0, 3).map(function (t) { return '<li><a class="chip" href="#suche" data-q="' + esc(t.q) + '">' + esc(t.label) + "</a></li>"; }).join("") +
      "</ul></div></div>" +
      '<aside class="featured" aria-labelledby="featured-h"><div class="featured-head"><h2 id="featured-h">Im Porträt</h2><a class="link-arrow" href="#suche" data-reset>Alle ' + PROFILES.length + " Köpfe</a></div>" +
      "<ul>" + featured.map(function (p) { return "<li>" + mini(p) + "</li>"; }).join("") + "</ul></aside>" +
      "</div></section>" +

      '<section class="section" aria-labelledby="fach-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Fachgebiete</p><h2 id="fach-h">Wissen aus sechs Disziplinen</h2></div></div>' +
      '<ul class="fach-grid">' + FACH.map(function (f) {
        return '<li><a class="fach-tile" href="#suche" data-fach="' + esc(f.key) + '"><h3>' + esc(f.label) + '</h3><span class="fach-count">' + plural(countByFach(f.key), "Profil", "Profile") + "</span><p>" + esc(f.beschreibung) + "</p></a></li>";
      }).join("") + "</ul></div></section>" +

      '<section class="section" aria-labelledby="koepfe-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Ausgewählte Köpfe</p><h2 id="koepfe-h">Persönlichkeiten, die Wissen verständlich machen</h2></div>' +
      '<a class="link-arrow" href="#suche" data-reset>Alle Profile ansehen →</a></div>' +
      '<ul class="card-grid card-grid--4">' + others.map(function (p) { return "<li>" + card(p, 3) + "</li>"; }).join("") + "</ul>" +
      "</div></section>" +

      '<section class="section" aria-labelledby="themen-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Aktuelle Themen</p><h2 id="themen-h">Worüber gerade gesprochen wird</h2></div></div>' +
      '<ul class="themen-list">' + THEMEN.map(function (t) {
        return '<li><a class="thema-link" href="#suche" data-q="' + esc(t.q) + '"><strong>' + esc(t.label) + "</strong><span>" + esc(t.zeile) + "</span></a></li>";
      }).join("") + "</ul></div></section>" +

      '<section class="section" aria-labelledby="how-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">So funktioniert’s</p><h2 id="how-h">In drei Schritten zur passenden Person</h2></div></div>' +
      '<ol class="steps">' +
      '<li class="step"><h3>Thema suchen</h3><p>Suchen Sie nach Thema, Fachgebiet oder Name und grenzen Sie nach Format, Region und Sprache ein.</p></li>' +
      '<li class="step"><h3>Profil ansehen</h3><p>Jedes Profil zeigt Vortragsthemen, Formate, Lebenslauf, Publikationen und Referenzen auf einen Blick.</p></li>' +
      '<li class="step"><h3>Anfrage stellen</h3><p>Sie schildern Anlass, Termin und Rahmen. Wir klären alles Weitere persönlich und melden uns innerhalb von ' + esc(SITE.antwortzeit) + ".</p></li>" +
      "</ol></div></section>" +

      '<section class="section" aria-labelledby="promise-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Unser Qualitätsversprechen</p><h2 id="promise-h">Ausgewählt, nicht gesammelt</h2></div></div>' +
      '<ul class="promise">' +
      "<li><h3>Kuratiert</h3><p>Aufgenommen wird nur, wer eine Professur innehat und Erfahrung mit Vorträgen oder Medien mitbringt.</p></li>" +
      "<li><h3>Geprüft</h3><p>Titel, Lebenslauf und Referenzen prüfen wir vor der Freischaltung und danach einmal im Jahr.</p></li>" +
      "<li><h3>Persönlich vermittelt</h3><p>Ihre Anfrage landet bei uns, nicht in einem anonymen Postfach. Wir stimmen Thema, Termin und Rahmen mit der Professorin oder dem Professor ab.</p></li>" +
      "</ul></div></section>" +

      '<section class="band" aria-labelledby="join-h"><div class="wrap">' +
      '<div><p class="eyebrow">Für Professorinnen und Professoren</p><h2 id="join-h">Ihr Auftritt, unabhängig von Ihrer Universität.</h2>' +
      "<p>Wir erstellen Ihr Profil, Sie geben es nur frei. Es bleibt Ihres, auch nach einem Wechsel oder nach der Emeritierung.</p></div>" +
      '<div><a class="btn btn-light" href="#aufnahme">Aufnahme anfragen</a></div>' +
      "</div></section>";

    var form = document.getElementById("home-search");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      state.q = document.getElementById("home-q").value.trim();
      resetFilters();
      location.hash = "suche";
    });
  }

  function selectHtml(id, label, all, options, value) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + "</label>" +
      '<select id="' + id + '"><option value="">' + esc(all) + "</option>" +
      options.map(function (o) { return '<option value="' + esc(o.value) + '"' + (o.value === value ? " selected" : "") + ">" + esc(o.label) + "</option>"; }).join("") +
      "</select></div>";
  }

  function pageSearch() {
    setNav("suche");
    setTitle("Köpfe finden");
    var regions = byKeys(unique(PROFILES.map(function (p) { return p.region; })));
    var sprachen = byKeys(unique([].concat.apply([], PROFILES.map(function (p) { return p.sprachen; }))));
    var desktop = window.matchMedia("(min-width: 900px)").matches;

    main().innerHTML =
      '<div class="wrap page-head search-top"><p class="eyebrow">Köpfe finden</p><h1>Wen suchen Sie?</h1>' +
      '<p class="lead">Suchen Sie nach Thema, Fachgebiet, Ort oder Name. Sie können auch einen ganzen Satz eingeben, etwa „KI und Ethik in Köln“.</p></div>' +
      '<div class="wrap">' +
      '<form class="searchform" role="search" id="search-form">' +
      '<div class="input-wrap"><label class="visually-hidden" for="search-q">Thema oder Name</label>' +
      '<input id="search-q" type="search" placeholder="Thema oder Name" autocomplete="off" enterkeyhint="search" value="' + esc(state.q) + '"></div>' +
      '<button class="btn btn-primary" type="submit">Suchen</button></form>' +
      '<div class="search-cols">' +
      '<details class="filters" id="filters"' + (desktop ? " open" : "") + '><summary>Filter <span class="filter-count" id="filter-count"></span></summary>' +
      '<div class="filter-body">' +
      selectHtml("f-fach", "Fachgebiet", "Alle Fachgebiete", FACH.map(function (f) { return { value: f.key, label: f.label }; }), state.fach) +
      selectHtml("f-format", "Format", "Alle Formate", FORMATE.map(function (f) { return { value: f, label: f }; }), state.format) +
      selectHtml("f-region", "Region", "Alle Regionen", regions.map(function (r) { return { value: r, label: r }; }), state.region) +
      selectHtml("f-sprache", "Sprache", "Alle Sprachen", sprachen.map(function (s) { return { value: s, label: s }; }), state.sprache) +
      '<fieldset class="field"><legend>Online oder vor Ort</legend><div class="segmented">' +
      [["", "Egal"], ["online", "Online"], ["vor-ort", "Vor Ort"]].map(function (m) {
        return '<label><input type="radio" name="f-modus" value="' + m[0] + '"' + (state.modus === m[0] ? " checked" : "") + ">" + m[1] + "</label>";
      }).join("") + "</div></fieldset>" +
      '<button type="button" class="btn btn-secondary" id="f-reset">Alles zurücksetzen</button>' +
      "</div></details>" +
      '<section class="results" aria-labelledby="result-count"><div class="results-head"><h2 class="result-count" id="result-count" aria-live="polite"></h2></div>' +
      '<div id="results"></div></section>' +
      "</div></div>";

    var input = document.getElementById("search-q");
    document.getElementById("search-form").addEventListener("submit", function (e) {
      e.preventDefault();
      state.q = input.value.trim();
      updateResults();
      if (!window.matchMedia("(min-width: 900px)").matches) input.blur();
    });
    input.addEventListener("input", function () { state.q = input.value; updateResults(); });
    [["f-fach", "fach"], ["f-format", "format"], ["f-region", "region"], ["f-sprache", "sprache"]].forEach(function (pair) {
      document.getElementById(pair[0]).addEventListener("change", function (e) { state[pair[1]] = e.target.value; updateResults(); });
    });
    document.querySelectorAll('input[name="f-modus"]').forEach(function (r) {
      r.addEventListener("change", function (e) { state.modus = e.target.value; updateResults(); });
    });
    document.getElementById("f-reset").addEventListener("click", function () {
      state.q = ""; resetFilters();
      pageSearch();
      document.getElementById("search-q").focus();
    });
    updateResults();
  }

  function updateResults() {
    var res = search();
    var list = res.list;
    var n = list.length;
    var countEl = document.getElementById("result-count");
    var box = document.getElementById("results");
    var fc = activeFilterCount();
    document.getElementById("filter-count").textContent = fc ? plural(fc, "aktiv", "aktiv") : "";
    var q = state.q.trim();
    if (n) {
      countEl.textContent = plural(n, "Profil", "Profile") + (q ? " zu „" + q + "“" : "");
      box.innerHTML = '<ul class="card-grid">' + list.map(function (p) { return "<li>" + card(p, 3) + "</li>"; }).join("") + "</ul>";
    } else {
      countEl.textContent = "Keine Profile gefunden";
      box.innerHTML = '<div class="empty"><h2>Dazu haben wir noch niemanden im Portal.</h2>' +
        "<p>" + (q ? "Für „" + esc(q) + "“" : "Für diese Auswahl") + " gibt es keinen Treffer. Versuchen Sie ein allgemeineres Stichwort, entfernen Sie einzelne Filter oder wählen Sie eines dieser Themen:</p>" +
        '<ul class="chips">' + THEMEN.slice(0, 5).map(function (t) { return '<li><button type="button" class="chip" data-q="' + esc(t.q) + '">' + esc(t.label) + "</button></li>"; }).join("") + "</ul>" +
        '<button type="button" class="btn btn-secondary" data-reset>Alles zurücksetzen</button>' +
        "<p>Oder schreiben Sie uns direkt an <strong>" + esc(SITE.kontaktEmail) + "</strong>. Wir suchen gern für Sie.</p></div>";
    }
  }

  function pageProfile(p) {
    setNav("suche");
    setTitle(p.titel + " " + p.vorname + " " + p.nachname);
    var others = PROFILES.filter(function (x) { return x.slug !== p.slug; });
    var same = others.filter(function (x) { return x.fach === p.fach; });
    var more = same.concat(others.filter(function (x) { return x.fach !== p.fach; })).slice(0, 2);
    var modus = [p.modus.indexOf("vor-ort") > -1 ? "vor Ort" : "", p.modus.indexOf("online") > -1 ? "online" : ""].filter(Boolean).join(" und ");
    modus = modus.charAt(0).toUpperCase() + modus.slice(1);

    var anfrageFields = [
      { id: "a-name", label: "Ihr Name", required: true, msg: "Bitte geben Sie Ihren Namen an.", autocomplete: "name" },
      { id: "a-org", label: "Organisation", required: true, msg: "Bitte geben Sie Ihre Organisation an.", autocomplete: "organization" },
      { id: "a-email", label: "E-Mail", type: "email", required: true, msg: "Bitte geben Sie Ihre E-Mail-Adresse an.", autocomplete: "email" },
      { id: "a-anlass", label: "Anlass", required: true, msg: "Bitte beschreiben Sie kurz den Anlass.", placeholder: "z. B. Jahrestagung, 200 Gäste" },
      { id: "a-datum", label: "Wunschtermin", type: "date" },
      { id: "a-ort", label: "Ort", placeholder: "Stadt oder „online“" },
      { id: "a-format", label: "Format", type: "select", options: [{ value: "", label: "Bitte wählen" }].concat(p.formate.map(function (f) { return { value: f, label: f }; })) },
      { id: "a-budget", label: "Budget", type: "select", options: [
        { value: "", label: "Bitte wählen" }, { value: "bis 1.500 €", label: "bis 1.500 €" }, { value: "1.500–3.000 €", label: "1.500–3.000 €" },
        { value: "3.000–6.000 €", label: "3.000–6.000 €" }, { value: "über 6.000 €", label: "über 6.000 €" }, { value: "noch offen", label: "noch offen" }] },
      { id: "a-nachricht", label: "Nachricht", type: "textarea", wide: true, placeholder: "Thema, gewünschte Dauer, Publikum und alles, was wir wissen sollten" }
    ];

    main().innerHTML =
      '<div class="wrap">' +
      '<p class="notice"><strong>Beispielprofil</strong><span>Person und Angaben sind fiktiv.</span></p>' +
      '<nav class="crumbs" aria-label="Brotkrumen"><a href="#suche" data-reset>Alle Köpfe</a><span aria-hidden="true">/</span>' +
      '<a href="#suche" data-fach="' + esc(p.fach) + '">' + esc(fachLabel(p.fach)) + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(p.vorname + " " + p.nachname) + "</span></nav>" +

      '<section class="p-hero" aria-labelledby="p-name">' +
      '<div class="p-pic">' + portrait(p, "lg") + sealSvg("seal-big") + "</div>" +
      '<div class="p-id"><p class="eyebrow">' + esc(fachLabel(p.fach)) + "</p>" +
      '<h1 id="p-name" tabindex="-1"><span class="t">' + esc(p.titel) + "</span>" + esc(p.vorname + " " + p.nachname) + "</h1>" +
      '<p class="p-prof">' + esc(p.professur) + "</p>" +
      '<p class="p-inst">' + esc(p.institution) + " · " + esc(p.ort) + ", " + esc(p.land) + "</p>" +
      '<div class="p-badges">' + sealButton(p) + statusBadge(p) + "</div></div>" +
      '<p class="p-bio">' + esc(p.kurzbio) + "</p>" +
      '<div class="p-cta"><button type="button" class="btn btn-primary" data-scroll-to="anfrage">' + esc(p.kurz) + ' anfragen</button><span class="hint">Persönliche Antwort innerhalb von ' + esc(SITE.antwortzeit) + "</span></div>" +
      "</section>" +

      '<div class="p-body">' +
      '<div class="p-part-a">' +
      '<section class="p-section" aria-labelledby="themen-p"><h2 id="themen-p">Vortragsthemen</h2><ul class="topics">' +
      p.themen.map(function (t) {
        return '<li class="topic"><div class="topic-head"><h3>' + esc(t.titel) + '</h3><span class="dur">' + esc(t.dauer) + "</span></div><p>" + esc(t.text) + "</p></li>";
      }).join("") + "</ul></section></div>" +

      '<aside class="p-side" aria-labelledby="facts-h"><div class="facts"><h2 id="facts-h">Auf einen Blick</h2><dl>' +
      '<div><dt>Formate</dt><dd class="tags">' + p.formate.map(function (f) { return '<span class="tag">' + esc(f) + "</span>"; }).join("") + "</dd></div>" +
      "<div><dt>Sprachen</dt><dd>" + esc(p.sprachen.join(", ")) + "</dd></div>" +
      "<div><dt>Region und Reisen</dt><dd>" + esc(p.reisen) + "</dd></div>" +
      "<div><dt>Online oder vor Ort</dt><dd>" + esc(modus) + "</dd></div>" +
      "<div><dt>Honorar</dt><dd>auf Anfrage</dd></div>" +
      "</dl>" +
      '<button type="button" class="btn btn-primary" data-scroll-to="anfrage">Anfrage stellen</button>' +
      '<div><p class="eyebrow" style="margin-bottom:6px">Weitere Profile im Netz</p><ul class="facts-links">' +
      ["Google Scholar", "LinkedIn", "ORCID"].map(function (l) { return '<li><span>' + l + '</span><span class="state">wird verknüpft</span></li>'; }).join("") +
      '</ul><p class="facts-note">Im Prototyp nicht verlinkt.</p></div>' +
      "</div></aside>" +

      '<div class="p-part-b">' +
      '<section class="p-section" aria-labelledby="video-h"><h2 id="video-h">Vortragsvideo</h2>' +
      '<div class="video" role="img" aria-label="Platzhalter für das Vortragsvideo: ' + esc(p.video.titel) + '"><span class="video-play" aria-hidden="true"></span>' +
      '<div class="video-cap" aria-hidden="true"><div><strong>' + esc(p.video.titel) + "</strong><span>" + esc(p.video.anlass) + '</span></div><span class="len">' + esc(p.video.laenge) + " Min.</span></div></div>" +
      '<p class="video-note">Platzhalter. Das Video wird bei Freischaltung eingebunden.</p></section>' +

      '<section class="p-section" aria-labelledby="vita-h"><h2 id="vita-h">Werdegang</h2><ol class="timeline">' +
      p.vita.map(function (v) { return '<li><span class="when">' + esc(v.zeit) + "</span><span>" + esc(v.text) + "</span></li>"; }).join("") +
      "</ol></section>" +

      '<section class="p-section" aria-labelledby="pub-h"><h2 id="pub-h">Ausgewählte Publikationen</h2><ul class="pubs">' +
      p.publikationen.map(function (b) { return '<li><span class="year">' + esc(b.jahr) + "</span><div><cite>" + esc(b.titel) + '</cite><span class="det">' + esc(b.details) + "</span></div></li>"; }).join("") +
      "</ul></section>" +

      '<div class="two-col">' +
      '<section class="p-section" aria-labelledby="media-h"><h2 id="media-h">Medienauftritte</h2><ul class="plain-list">' +
      p.medien.map(function (m) { return '<li><span class="kind">' + esc(m.art) + " · " + esc(m.jahr) + "</span>" + esc(m.titel) + "</li>"; }).join("") +
      "</ul></section>" +
      '<section class="p-section" aria-labelledby="ref-h"><h2 id="ref-h">Vorträge und Referenzen</h2><ul class="plain-list">' +
      p.referenzen.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") +
      "</ul></section></div>" +

      '<section class="form-card" id="anfrage" aria-labelledby="anfrage-h"><h2 id="anfrage-h">Anfrage an ' + esc(p.kurz) + "</h2>" +
      '<p class="form-intro">Ihre Anfrage geht an die Redaktion von ' + esc(SITE.name) + ". Wir prüfen sie, stimmen Termin und Rahmen persönlich mit " + esc(p.kurz) + " ab und melden uns innerhalb von " + esc(SITE.antwortzeit) + ".</p>" +
      formShell("anfrage-form", anfrageFields, "Anfrage senden", "* Pflichtfeld") +
      "</section>" +
      "</div></div></div>" +

      '<section class="section more-section" aria-labelledby="more-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Weitere Köpfe</p><h2 id="more-h">Das könnte Sie auch interessieren</h2></div><a class="link-arrow" href="#suche" data-reset>Alle Profile ansehen →</a></div>' +
      '<ul class="card-grid">' + more.map(function (x) { return "<li>" + card(x, 3) + "</li>"; }).join("") + "</ul></div></section>";

    attachForm(document.getElementById("anfrage-form"),
      "<h3>Vielen Dank für Ihre Anfrage.</h3><p>Wir melden uns innerhalb von " + esc(SITE.antwortzeit) + " bei Ihnen und stimmen alles Weitere mit " + esc(p.kurz) + " ab.</p>");

    // Seal-Popover
    document.querySelectorAll(".seal-wrap").forEach(function (wrap) {
      var btn = wrap.querySelector(".seal-btn");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !wrap.classList.contains("open");
        wrap.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    // Mobile Anfrageleiste
    var bar = document.getElementById("mobilebar");
    bar.innerHTML = '<button type="button" class="btn btn-primary" data-scroll-to="anfrage">' + esc(p.kurz) + " anfragen</button>";
    bar.hidden = false;
    bar.classList.remove("is-hidden");
    document.body.classList.add("has-mobilebar");
    if ("IntersectionObserver" in window) {
      // Leiste ausblenden, solange der Button im Kopf oder das Formular sichtbar ist
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { seen[en.target.id || "cta"] = en.isIntersecting; });
        bar.classList.toggle("is-hidden", !!(seen.anfrage || seen.cta));
      }, { threshold: 0.05 });
      io.observe(document.getElementById("anfrage"));
      io.observe(document.querySelector(".p-cta"));
      cleanup.push(function () { io.disconnect(); });
    }
  }

  function pageProfs(scrollTarget) {
    setNav("fuer-professoren");
    setTitle("Für Professoren");
    var fields = [
      { id: "b-name", label: "Ihr Name mit Titel", required: true, msg: "Bitte geben Sie Ihren Namen an.", autocomplete: "name", placeholder: "z. B. Prof. Dr. Anna Beispiel" },
      { id: "b-inst", label: "Universität oder Hochschule", required: true, msg: "Bitte geben Sie Ihre Universität oder Hochschule an.", autocomplete: "organization" },
      { id: "b-email", label: "E-Mail", type: "email", required: true, msg: "Bitte geben Sie Ihre E-Mail-Adresse an.", autocomplete: "email" },
      { id: "b-fach", label: "Fachgebiet", type: "select", required: true, msg: "Bitte wählen Sie Ihr Fachgebiet.", options: [{ value: "", label: "Bitte wählen" }].concat(FACH.map(function (f) { return { value: f.key, label: f.label }; })).concat([{ value: "anderes", label: "Anderes Fachgebiet" }]) },
      { id: "b-paket", label: "Interesse an", type: "select", options: [{ value: "", label: "Noch offen" }, { value: "basis", label: "Basis" }, { value: "premium", label: "Premium" }] },
      { id: "b-tel", label: "Telefon für ein kurzes Gespräch", type: "tel", autocomplete: "tel", hint: "Freiwillig" },
      { id: "b-nachricht", label: "Ihre Themen und Erfahrungen", type: "textarea", wide: true, placeholder: "Worüber sprechen Sie gern? Wo haben Sie bereits vorgetragen?" }
    ];

    main().innerHTML =
      '<section class="pro-hero"><div class="wrap">' +
      '<p class="eyebrow">Für Professorinnen und Professoren</p>' +
      '<h1 tabindex="-1">Ihr Auftritt. Unabhängig von Ihrer Universität.</h1>' +
      '<p class="lead">' + esc(SITE.name) + " ist ein kuratiertes Portal für Wissenschaftlerinnen und Wissenschaftler, die nach außen wirken wollen: mit Vorträgen, Beratung und in den Medien. Wir erstellen Ihr Profil. Sie geben es nur frei.</p>" +
      '<div class="actions"><button type="button" class="btn btn-primary" data-scroll-to="aufnahme">Aufnahme anfragen</button>' +
      '<a class="btn btn-secondary" href="#profil-clara-venhoff">Beispielprofil ansehen</a></div>' +
      "</div></section>" +

      '<section class="section" aria-labelledby="nutzen-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Ihr Nutzen</p><h2 id="nutzen-h">Was Ihnen ein Profil bringt</h2></div></div>' +
      '<ul class="benefits">' +
      "<li><h3>Ein Auftritt, der Ihnen gehört</h3><p>Ihre Uni-Seite gehört der Universität und verschwindet bei einem Wechsel oder nach der Emeritierung. Ihr Profil hier bleibt.</p></li>" +
      "<li><h3>Gefunden von denen, die anfragen</h3><p>Veranstalter, Unternehmen, Verbände und Redaktionen suchen hier gezielt nach Themen, nicht nach Publikationslisten.</p></li>" +
      "<li><h3>Kein Aufwand für Sie</h3><p>Ein Gespräch von etwa 45 Minuten genügt. Texte, Gestaltung und Pflege übernehmen wir. Sie geben das Ergebnis frei.</p></li>" +
      "<li><h3>Nur passende Anfragen</h3><p>Anfragen laufen über uns. Wir klären Thema, Rahmen und Budget vorab und leiten nur weiter, was zu Ihnen passt.</p></li>" +
      "</ul></div></section>" +

      '<section class="section" aria-labelledby="ablauf-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Ablauf</p><h2 id="ablauf-h">In vier Schritten online</h2></div></div>' +
      '<ol class="steps steps--4">' +
      '<li class="step"><h3>Gespräch</h3><p>Wir lernen Sie und Ihre Themen in einem persönlichen Gespräch kennen, vor Ort oder per Video.</p></li>' +
      '<li class="step"><h3>Wir erstellen Ihr Profil</h3><p>Wir schreiben Kurzbiografie, Vortragsthemen und Lebenslauf und gestalten Ihre Seite.</p></li>' +
      '<li class="step"><h3>Sie geben frei</h3><p>Sie lesen alles in Ruhe. Änderungswünsche setzen wir um, bis Sie zufrieden sind.</p></li>' +
      '<li class="step"><h3>Online</h3><p>Ihr Profil ist auffindbar. Anfragen erhalten Sie von uns vorgeprüft.</p></li>' +
      "</ol></div></section>" +

      '<section class="section" aria-labelledby="pakete-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Pakete</p><h2 id="pakete-h">Zwei Wege ins Portal</h2>' +
      '<p class="muted">Die Preise nennen wir Ihnen im persönlichen Gespräch.</p></div></div>' +
      '<div class="packages">' +
      '<article class="package"><div class="package-top"><h3>Basis</h3><span class="price">Jahresbeitrag</span></div>' +
      "<p>Ihr professionelles Profil mit allem, was Veranstalter brauchen.</p>" +
      '<ul class="checklist"><li>Profilseite mit Porträt, Kurzbiografie und Vortragsthemen</li><li>Lebenslauf, Publikationen und Referenzen</li><li>Siegel „Geprüftes Profil“</li><li>Auffindbar in Suche und Fachgebieten</li><li>Anfragen vorgeprüft über uns</li><li>Jährliche Aktualisierung</li></ul>' +
      '<button type="button" class="btn btn-secondary" data-scroll-to="aufnahme" data-paket="basis">Basis anfragen</button></article>' +
      '<article class="package package--premium"><div class="package-top"><h3>Premium</h3><span class="price">Jahresbeitrag</span></div>' +
      "<p>Für alle, die regelmäßig vortragen und sichtbar sein wollen.</p>" +
      '<ul class="checklist"><li>Alles aus Basis</li><li class="plus">Eigene Domain, z. B. prof-mueller.de</li><li class="plus">Vortragsvideo, geschnitten aus Ihrem Material</li><li class="plus">Hervorgehobene Platzierung auf Startseite und Themenseiten</li><li class="plus">Profil auf Deutsch und Englisch</li><li class="plus">Aktualisierung jederzeit auf Zuruf</li></ul>' +
      '<button type="button" class="btn btn-primary" data-scroll-to="aufnahme" data-paket="premium">Premium anfragen</button></article>' +
      "</div></div></section>" +

      '<section class="section" aria-labelledby="krit-h"><div class="wrap criteria">' +
      '<div><p class="eyebrow">Kuratierung</p><h2 id="krit-h" style="font-size:var(--fs-xl);margin-top:10px">Wer aufgenommen wird</h2></div>' +
      "<div><p>Die Aufnahme erfolgt auf Einladung oder auf Ihre Anfrage hin. Wir prüfen jede Anfrage persönlich. Voraussetzung sind eine Professur, auch emeritiert oder als Honorarprofessur, sowie Erfahrung mit Vorträgen, Beratung oder Medien.</p>" +
      '<ul class="checklist" style="margin-top:18px"><li>Professur an einer Universität oder Hochschule</li><li>Erfahrung mit Vorträgen, Beratung oder Medien</li><li>Themen, die über das eigene Fach hinaus interessieren</li></ul></div>' +
      "</div></section>" +

      '<section class="section" aria-labelledby="faq-h"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Häufige Fragen</p><h2 id="faq-h">Was Professorinnen und Professoren uns fragen</h2></div></div>' +
      '<div class="faq">' +
      faq("Ich habe keine Zeit, mich darum zu kümmern.", "<p>Das müssen Sie auch nicht. Nach einem Gespräch von etwa 45 Minuten schreiben und gestalten wir Ihr Profil. Sie lesen es, geben es frei, fertig. Die laufende Pflege übernehmen wir ebenfalls.</p>") +
      faq("Wirkt das nicht unseriös oder kommerziell?", "<p>" + esc(SITE.name) + " ist kein Massenverzeichnis. Wir nehmen nur auf, wer unsere Kriterien erfüllt, prüfen jedes Profil und setzen auf eine ruhige, hochwertige Gestaltung ohne Werbung.</p>") +
      faq("Werde ich dann mit Anfragen überschwemmt?", "<p>Nein. Alle Anfragen kommen zuerst zu uns. Wir klären Anlass, Termin und Budget und leiten nur weiter, was zu Ihnen und Ihren Vorgaben passt. Sie entscheiden immer selbst, ob Sie zusagen.</p>") +
      faq("Ich habe doch schon eine Seite an meiner Universität.", "<p>Die Uni-Seite gehört der Universität, ist meist für Studierende und Fachkollegen geschrieben und verschwindet bei einem Wechsel oder nach der Emeritierung. Ihr Profil hier gehört Ihnen und richtet sich an Veranstalter, Unternehmen und Medien.</p>") +
      faq("Was unterscheidet Sie von Rednerdiensten und Wissenschaftsprofilen?", "<p>Klassische Rednerdienste vermitteln vor allem Motivationsredner und Prominente. Google Scholar, ResearchGate oder ORCID sind für Fachkollegen gemacht. " + esc(SITE.name) + " verbindet beides: wissenschaftliche Substanz, aufbereitet für die Menschen, die Vorträge und Expertise anfragen.</p>") +
      faq("Was kostet ein Profil?", "<p>Es gibt einen Jahresbeitrag für Basis oder Premium. Die genauen Preise nennen wir Ihnen im ersten Gespräch. Das Gespräch selbst ist unverbindlich.</p>") +
      "</div></div></section>" +

      '<section class="section" aria-labelledby="aufnahme-h"><div class="wrap">' +
      '<div class="form-card" id="aufnahme"><h2 id="aufnahme-h">Aufnahme anfragen</h2>' +
      '<p class="form-intro">Erzählen Sie uns kurz von sich. Wir melden uns innerhalb von ' + esc(SITE.antwortzeit) + " für ein unverbindliches Gespräch.</p>" +
      formShell("aufnahme-form", fields, "Aufnahme anfragen", "* Pflichtfeld") +
      "</div></div></section>";

    attachForm(document.getElementById("aufnahme-form"),
      "<h3>Vielen Dank für Ihr Interesse.</h3><p>Wir melden uns innerhalb von " + esc(SITE.antwortzeit) + " bei Ihnen, um einen Termin für ein erstes Gespräch zu vereinbaren.</p>");

    if (scrollTarget) {
      requestAnimationFrame(function () {
        var el = document.getElementById(scrollTarget);
        el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  }

  function faq(q, a) {
    return "<details><summary>" + esc(q) + '</summary><div class="answer">' + a + "</div></details>";
  }

  function pageImpressum() {
    setNav("");
    setTitle("Impressum");
    main().innerHTML =
      '<div class="wrap page-head"><p class="eyebrow">Rechtliches</p><h1 tabindex="-1">Impressum</h1></div>' +
      '<div class="wrap"><div class="legal">' +
      '<p class="placeholder-box">Platzhalter für den Prototyp. Die Angaben werden vor dem Start durch die tatsächlichen Daten des Betreibers ersetzt und rechtlich geprüft.</p>' +
      "<section><h2>Angaben gemäß § 5 DDG</h2><p>" + esc(SITE.name) + ' <span class="ph">(Arbeitstitel)</span><br><span class="ph">Name des Betreibers</span><br><span class="ph">Straße und Hausnummer</span><br><span class="ph">Postleitzahl und Ort</span></p></section>' +
      "<section><h2>Kontakt</h2><p>E-Mail: " + esc(SITE.kontaktEmail) + '<br>Telefon: <span class="ph">wird ergänzt</span></p></section>' +
      '<section><h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><p><span class="ph">Name und Anschrift wie oben</span></p></section>' +
      "<section><h2>Bildnachweis</h2>" + bildnachweis() + "</section>" +
      "<section><h2>Hinweis zu den Profilen</h2><p>Alle Profile in diesem Prototyp sind erfunden. Namen, Lebensläufe, Publikationen und Referenzen dienen nur der Veranschaulichung. Ähnlichkeiten mit realen Personen sind nicht beabsichtigt.</p></section>" +
      "</div></div>";
  }

  function bildnachweis() {
    var mit = PROFILES.filter(function (p) { return p.foto && p.fotoNachweis; });
    if (!mit.length) return "<p>Die Porträts sind gestaltete Platzhalter. Bildnachweise folgen, sobald Fotos eingebunden sind.</p>";
    return "<p>Die Porträts sind Symbolfotos. Die abgebildeten Personen stehen in keinem Zusammenhang mit den fiktiven Profilen.</p><ul>" +
      mit.map(function (p) { return "<li>" + esc(p.vorname + " " + p.nachname) + ": " + esc(p.fotoNachweis) + "</li>"; }).join("") + "</ul>";
  }

  function pageDatenschutz() {
    setNav("");
    setTitle("Datenschutz");
    main().innerHTML =
      '<div class="wrap page-head"><p class="eyebrow">Rechtliches</p><h1 tabindex="-1">Datenschutzerklärung</h1></div>' +
      '<div class="wrap"><div class="legal">' +
      '<p class="placeholder-box">Platzhalter für den Prototyp. Die vollständige Datenschutzerklärung wird vor dem Start erstellt und rechtlich geprüft.</p>' +
      '<section><h2>Verantwortliche Stelle</h2><p>' + esc(SITE.name) + ', <span class="ph">Name und Anschrift des Betreibers</span>, E-Mail: ' + esc(SITE.kontaktEmail) + "</p></section>" +
      "<section><h2>Anfrage- und Aufnahmeformulare</h2><p>Im Prototyp werden Formulareingaben weder gespeichert noch übertragen. Im späteren Betrieb verarbeiten wir die Angaben ausschließlich, um Ihre Anfrage zu bearbeiten und an die angefragte Person weiterzuleiten (Art. 6 Abs. 1 lit. b DSGVO).</p></section>" +
      "<section><h2>Schriftarten</h2><p>Dieser Prototyp lädt Schriftarten von Google Fonts. Dabei wird Ihre IP-Adresse an Google übermittelt. Vor dem Start werden die Schriften lokal eingebunden, sodass keine Daten mehr an Dritte gehen.</p></section>" +
      "<section><h2>Ihre Rechte</h2><ul><li>Auskunft über Ihre gespeicherten Daten</li><li>Berichtigung unrichtiger Daten</li><li>Löschung und Einschränkung der Verarbeitung</li><li>Widerspruch gegen die Verarbeitung</li><li>Datenübertragbarkeit</li><li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li></ul></section>" +
      "</div></div>";
  }

  function pageNotFound() {
    setNav("");
    setTitle("Seite nicht gefunden");
    main().innerHTML =
      '<div class="wrap page-head"><p class="eyebrow">Fehler 404</p><h1 tabindex="-1">Diese Seite gibt es nicht.</h1>' +
      '<p class="lead">Vielleicht wurde der Link falsch kopiert. Von der Startseite aus finden Sie alle Profile.</p>' +
      '<p style="margin-top:24px"><a class="btn btn-primary" href="#start">Zur Startseite</a></p></div>' +
      '<div style="height:80px"></div>';
  }

  /* ---------------- Router ---------------- */

  var lastRoute = null;

  function route(initial) {
    cleanup.forEach(function (fn) { fn(); });
    cleanup = [];
    var bar = document.getElementById("mobilebar");
    bar.hidden = true;
    bar.innerHTML = "";
    document.body.classList.remove("has-mobilebar");

    var h = decodeURIComponent(location.hash.replace(/^#/, "")) || "start";
    var focusTarget = null;
    if (h === "main") return; // Sprunglink
    if (h === "start") pageHome();
    else if (h === "suche") pageSearch();
    else if (h === "fuer-professoren") pageProfs();
    else if (h === "aufnahme") pageProfs("aufnahme");
    else if (h === "impressum") pageImpressum();
    else if (h === "datenschutz") pageDatenschutz();
    else if (h.indexOf("profil-") === 0) {
      var slug = h.slice(7);
      var p = PROFILES.filter(function (x) { return x.slug === slug; })[0];
      if (p) pageProfile(p); else pageNotFound();
    } else pageNotFound();

    if (h !== "aufnahme") window.scrollTo(0, 0);
    if (!initial && lastRoute !== null) {
      focusTarget = main().querySelector("h1");
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    }
    lastRoute = h;
  }

  /* ---------------- Globale Klicks ---------------- */

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-q], [data-fach], [data-reset], [data-scroll-to], [data-skip]") : null;

    // Siegel-Popover schließen, wenn außerhalb geklickt wird
    document.querySelectorAll(".seal-wrap.open").forEach(function (w) {
      if (!w.contains(e.target)) { w.classList.remove("open"); w.querySelector(".seal-btn").setAttribute("aria-expanded", "false"); }
    });

    if (!t) return;

    if (t.hasAttribute("data-skip")) {
      e.preventDefault();
      var m = main();
      m.focus();
      m.scrollIntoView();
      return;
    }

    if (t.hasAttribute("data-scroll-to")) {
      e.preventDefault();
      var target = document.getElementById(t.getAttribute("data-scroll-to"));
      var paket = t.getAttribute("data-paket");
      if (paket) {
        var sel = document.getElementById("b-paket");
        if (sel) sel.value = paket;
      }
      scrollToEl(target);
      var first = target && target.querySelector("input, select, textarea");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
      return;
    }

    // Suche mit Vorgaben öffnen
    if (t.hasAttribute("data-q") || t.hasAttribute("data-fach") || t.hasAttribute("data-reset")) {
      resetFilters();
      state.q = t.getAttribute("data-q") || "";
      if (t.hasAttribute("data-fach")) state.fach = t.getAttribute("data-fach");
      if (location.hash === "#suche") {
        e.preventDefault();
        pageSearch();
        window.scrollTo(0, 0);
        var input = document.getElementById("search-q");
        if (input) input.focus({ preventScroll: true });
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".seal-wrap.open").forEach(function (w) {
      w.classList.remove("open");
      var b = w.querySelector(".seal-btn");
      b.setAttribute("aria-expanded", "false");
      b.focus();
    });
  });

  window.addEventListener("hashchange", function () { route(false); });

  renderShell();
  route(true);
})();
