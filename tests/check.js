/*
 * Automatische Prüfung des Prototyps mit Playwright.
 * Aufruf: node tests/check.js  (startet selbst einen lokalen Server)
 * Screenshots landen in tests/shots/ (nicht im Repository).
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(__dirname, "shots");
const PORT = 8765;
const BASE = `http://127.0.0.1:${PORT}/index.html`;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
}

function serve() {
  return http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const file = path.join(ROOT, url === "/" ? "index.html" : url);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end("nf"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  }).listen(PORT);
}

const ROUTES = ["start", "suche", "fuer-professoren", "impressum", "datenschutz", "profil-clara-venhoff", "profil-ingrid-sommerfeld", "profil-lukas-pirchner"];
const ALL_PROFILE_ROUTES = ["clara-venhoff", "matthias-ohlendorf", "miriam-achterberg", "nora-gasser-imhof", "ingrid-sommerfeld", "ansgar-tellkamp", "lukas-pirchner", "deniz-aydemir"].map((s) => "profil-" + s);
const WIDTHS = [390, 820, 1180, 1440];
const HEIGHTS = { 390: 844, 820: 1180, 1180: 820, 1440: 900 };

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const server = serve();
  const browser = await chromium.launch();
  const consoleErrors = [];

  async function newPage(width, scheme) {
    const ctx = await browser.newContext({ viewport: { width, height: HEIGHTS[width] }, colorScheme: scheme, deviceScaleFactor: 1, hasTouch: width < 1000 });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) consoleErrors.push(`${width}/${scheme}: ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`${width}/${scheme}: pageerror ${e.message}`));
    return { ctx, page };
  }

  async function go(page, hash, fresh) {
    if (fresh) await page.goto("about:blank");
    await page.goto(BASE + "#" + hash);
    await page.waitForSelector("#main h1");
    await page.evaluate(() => document.fonts && document.fonts.ready);
  }

  /* ---------- 1. Darstellung: alle Breiten, hell und dunkel ---------- */
  for (const scheme of ["light", "dark"]) {
    for (const w of WIDTHS) {
      const { ctx, page } = await newPage(w, scheme);
      for (const r of ROUTES.concat(ALL_PROFILE_ROUTES.filter((x) => !ROUTES.includes(x)))) {
        await go(page, r);
        const m = await page.evaluate(() => {
          const de = document.documentElement;
          const overflow = de.scrollWidth - de.clientWidth;
          // Elemente, die über den Rand ragen
          const wide = [];
          document.querySelectorAll("#app *").forEach((el) => {
            const b = el.getBoundingClientRect();
            if (b.width && (b.right > de.clientWidth + 1 || b.left < -1)) {
              const cs = getComputedStyle(el);
              if (cs.position !== "fixed" && !el.closest(".visually-hidden") && !el.closest(".seal-pop") && !el.closest(".mobilebar.is-hidden")) wide.push(el.tagName + "." + el.className);
            }
          });
          // Abgeschnittener Text (overflow hidden mit scrollWidth > clientWidth)
          const clipped = [];
          document.querySelectorAll("#app h1, #app h2, #app h3, #app p, #app a, #app button, #app span, #app li").forEach((el) => {
            if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden" && !el.closest(".portrait")) clipped.push(el.tagName + ":" + el.textContent.slice(0, 30));
          });
          // Touch-Ziele
          const small = [];
          document.querySelectorAll("#app a, #app button, #app select, #app input:not([type=radio]), #app textarea, #app summary").forEach((el) => {
            const b = el.getBoundingClientRect();
            if (!b.width || el.closest("[hidden]")) return;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none") return;
            if (b.height < 43.5) small.push(el.tagName + "(" + Math.round(b.width) + "x" + Math.round(b.height) + "):" + el.textContent.trim().slice(0, 25));
          });
          const bodyBg = getComputedStyle(document.body).backgroundColor;
          return { overflow, wide: wide.slice(0, 5), clipped: clipped.slice(0, 5), small: small.slice(0, 8), bodyBg };
        });
        const tag = `${r} @${w}px ${scheme}`;
        check(`Kein horizontales Scrollen: ${tag}`, m.overflow <= 0 && m.wide.length === 0, `overflow=${m.overflow} ${m.wide.join(", ")}`);
        check(`Kein abgeschnittener Text: ${tag}`, m.clipped.length === 0, m.clipped.join(" | "));
        check(`Touch-Ziele ≥ 44 px: ${tag}`, m.small.length === 0, m.small.join(" | "));
        if (ROUTES.includes(r)) {
          await page.screenshot({ path: path.join(SHOTS, `${r}_${w}_${scheme}.png`), fullPage: true });
          await page.screenshot({ path: path.join(SHOTS, `${r}_${w}_${scheme}_fold.png`), fullPage: false });
        }
      }
      // Startseite: Hero + Suche + ausgewählte Köpfe ohne Scrollen sichtbar (iPad)
      if (w === 820 || w === 1180) {
        await go(page, "start");
        const fold = await page.evaluate(() => {
          const h = window.innerHeight;
          const s = document.getElementById("home-q").getBoundingClientRect().bottom;
          const items = Array.from(document.querySelectorAll(".featured li")).map((li) => li.getBoundingClientRect().bottom);
          return { h, s, last: Math.max.apply(null, items) };
        });
        check(`iPad ${w}px ${scheme}: Claim, Suche und 4 Köpfe ohne Scrollen sichtbar`, fold.s < fold.h && fold.last <= fold.h, JSON.stringify(fold));
      }
      await ctx.close();
    }
  }

  /* ---------- 2. Funktion ---------- */
  const { ctx, page } = await newPage(1180, "light");

  // Direktaufruf aller Seiten
  for (const r of ROUTES.concat(ALL_PROFILE_ROUTES)) {
    await go(page, r);
    const notFound = await page.evaluate(() => /Diese Seite gibt es nicht/.test(document.querySelector("#main h1").textContent));
    check(`Direktaufruf #${r}`, !notFound);
  }
  await go(page, "gibt-es-nicht");
  check("Unbekannte Adresse zeigt Fehlerseite", await page.evaluate(() => /gibt es nicht/.test(document.querySelector("#main h1").textContent)));

  // Alle internen Links führen zu gültigen Zielen
  const allHrefs = new Set();
  for (const r of ROUTES.concat(ALL_PROFILE_ROUTES)) {
    await go(page, r);
    (await page.evaluate(() => Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")))).forEach((h) => allHrefs.add(h));
  }
  const external = [...allHrefs].filter((h) => !h.startsWith("#"));
  check("Keine externen oder toten Links", external.length === 0, external.join(", "));
  for (const h of allHrefs) {
    if (!h.startsWith("#") || h === "#main") continue;
    await go(page, h.slice(1));
    const bad = await page.evaluate(() => /gibt es nicht/.test(document.querySelector("#main h1").textContent));
    check(`Link ${h} führt zu einer gültigen Seite`, !bad);
  }

  // Suche
  async function searchFor(q) {
    await go(page, "suche");
    await page.fill("#search-q", q);
    await page.waitForTimeout(50);
    return page.evaluate(() => ({
      count: document.getElementById("result-count").textContent,
      names: Array.from(document.querySelectorAll("#results .card-name")).map((n) => n.textContent),
      empty: !!document.querySelector("#results .empty")
    }));
  }
  let r1 = await searchFor("KI Ethik Köln");
  check("Suche „KI Ethik Köln“ zeigt Vorzeigeprofil zuerst", r1.names[0] && r1.names[0].includes("Venhoff"), r1.names.join(" | "));
  r1 = await searchFor("Jemand, der in Köln 45 Minuten über KI und Ethik spricht.");
  check("Satzsuche (F1) zeigt Vorzeigeprofil zuerst", r1.names[0] && r1.names[0].includes("Venhoff"), r1.count + " " + r1.names.join(" | "));
  r1 = await searchFor("koeln");
  check("Umlaut-Schreibweise „koeln“ findet Köln", r1.names.some((n) => n.includes("Venhoff")), r1.names.join(" | "));
  r1 = await searchFor("KOLN");
  check("Großschreibung und „KOLN“ findet Köln", r1.names.some((n) => n.includes("Venhoff")), r1.names.join(" | "));
  r1 = await searchFor("Müller-Lüdenscheidt-Quantenyoga");
  check("Suche ohne Treffer zeigt Hinweis", r1.empty, r1.count);
  r1 = await searchFor("Sommerfeld");
  check("Namenssuche findet Person", r1.names.length === 1 && r1.names[0].includes("Sommerfeld"), r1.names.join(" | "));

  for (const t of await page.evaluate(() => window.AKTUELLE_THEMEN)) {
    const rr = await searchFor(t.q);
    check(`Thema „${t.label}“ liefert Treffer`, rr.names.length > 0, rr.count);
  }

  // Fachgebiete und Filter
  const fach = await page.evaluate(() => window.FACHGEBIETE.map((f) => f.key));
  for (const f of fach) {
    await go(page, "suche");
    await page.click("#f-reset");
    await page.selectOption("#f-fach", f);
    const n = await page.$$eval("#results .card", (c) => c.length);
    check(`Fachgebiet-Filter „${f}“ liefert Treffer`, n > 0, String(n));
  }
  await go(page, "suche");
  for (const [sel, val] of [["#f-format", "Gutachten"], ["#f-region", "Schweiz"], ["#f-sprache", "Türkisch"]]) {
    await go(page, "suche");
    await page.click("#f-reset");
    await page.selectOption(sel, val);
    const n = await page.$$eval("#results .card", (c) => c.length);
    check(`Filter ${sel} = ${val} liefert Treffer`, n > 0, String(n));
  }
  await go(page, "suche");
  await page.click("#f-reset");
  await page.check('input[name="f-modus"][value="online"]');
  check("Filter Online liefert Treffer", (await page.$$eval("#results .card", (c) => c.length)) > 0);
  await page.selectOption("#f-fach", "ki");
  await page.selectOption("#f-region", "Nordrhein-Westfalen");
  await page.selectOption("#f-sprache", "Türkisch");
  let comb = await page.$$eval("#results .card-name", (c) => c.map((x) => x.textContent));
  check("Kombinierte Filter (KI + NRW + Türkisch + online) → genau Aydemir", comb.length === 1 && comb[0].includes("Aydemir"), comb.join(" | "));
  await page.selectOption("#f-format", "Podium");
  check("Kombination ohne Treffer zeigt Hinweis", await page.$("#results .empty") !== null);
  const fcount = await page.textContent("#filter-count");
  check("Anzahl aktiver Filter wird angezeigt", /5/.test(fcount), fcount);
  await page.click("#f-reset");
  const afterReset = await page.$$eval("#results .card", (c) => c.length);
  const fcount2 = await page.textContent("#filter-count");
  check("Zurücksetzen zeigt wieder alle 8 Profile", afterReset === 8 && fcount2 === "", `${afterReset} "${fcount2}"`);

  // Klick auf Fachgebiet-Kachel und Themen auf der Startseite
  await go(page, "start");
  await page.click('.fach-tile[data-fach="recht"]');
  await page.waitForSelector("#f-fach");
  check("Fachgebiet-Kachel öffnet gefilterte Suche", (await page.$eval("#f-fach", (s) => s.value)) === "recht");
  await go(page, "start");
  await page.click('.thema-link[data-q="KI Recht"]');
  await page.waitForSelector("#search-q");
  const firstThema = await page.$eval("#results .card-name", (c) => c.textContent);
  check("Thema „KI im Recht“ zeigt Achterberg zuerst", firstThema.includes("Achterberg"), firstThema);

  // Startseiten-Suche
  await go(page, "start");
  await page.fill("#home-q", "Schlaf");
  await page.press("#home-q", "Enter");
  await page.waitForSelector("#search-q");
  check("Suche auf der Startseite führt zu Ergebnissen", (await page.$eval("#search-q", (i) => i.value)) === "Schlaf" && (await page.$$eval("#results .card", (c) => c.length)) === 1);

  // Zurück-Button
  await go(page, "start");
  await page.click('a.mini[href="#profil-clara-venhoff"]');
  await page.waitForSelector("#p-name");
  await page.goBack();
  await page.waitForSelector("#home-q");
  check("Browser-Zurück funktioniert (Profil → Start)", true);
  await page.goForward();
  await page.waitForSelector("#p-name");
  check("Browser-Vor funktioniert", (await page.textContent("#p-name")).includes("Venhoff"));

  // Siegel-Popover
  await go(page, "profil-clara-venhoff");
  await page.click(".seal-btn");
  check("Siegel-Erklärung öffnet sich beim Antippen", await page.$eval(".seal-pop", (e) => getComputedStyle(e).display !== "none"));
  await page.keyboard.press("Escape");
  await page.mouse.move(5, 5);
  check("Siegel-Erklärung schließt mit Escape", await page.$eval(".seal-pop", (e) => getComputedStyle(e).display === "none"));

  // Anfrageformular
  await go(page, "profil-clara-venhoff");
  await page.click("#anfrage-form button[type=submit]");
  const errs = await page.$$eval("#anfrage-form .field-error:not([hidden])", (e) => e.map((x) => x.textContent));
  check("Leeres Absenden zeigt 4 Fehler an den Pflichtfeldern", errs.length === 4, errs.join(" | "));
  check("Fokus springt auf erstes fehlerhaftes Feld", (await page.evaluate(() => document.activeElement.id)) === "a-name");
  await page.fill("#a-name", "Erika Beispiel");
  await page.fill("#a-org", "Musterverband e. V.");
  await page.fill("#a-email", "erika@beispiel");
  await page.fill("#a-anlass", "Jahrestagung");
  await page.click("#anfrage-form button[type=submit]");
  const errs2 = await page.$$eval("#anfrage-form .field-error:not([hidden])", (e) => e.map((x) => x.textContent));
  check("Ungültige E-Mail wird erkannt", errs2.length === 1 && /E-Mail/.test(errs2[0]), errs2.join(" | "));
  await page.fill("#a-email", "erika@beispiel.de");
  check("Fehler verschwindet nach Korrektur", (await page.$$eval("#anfrage-form .field-error:not([hidden])", (e) => e.length)) === 0);
  await page.selectOption("#a-format", "Keynote");
  await page.click("#anfrage-form button[type=submit]");
  check("Gültige Eingaben führen zur Bestätigung", /Vielen Dank/.test(await page.textContent(".confirm")));
  await page.click(".confirm button");
  check("„Weitere Anfrage stellen“ zeigt leeres Formular", (await page.$eval("#a-name", (i) => i.value)) === "");

  // Aufnahmeformular und Paket-Vorauswahl
  await go(page, "fuer-professoren");
  await page.click('button[data-paket="premium"]');
  check("Premium-Button wählt Paket vor", (await page.$eval("#b-paket", (s) => s.value)) === "premium");
  await page.click("#aufnahme-form button[type=submit]");
  const e3 = await page.$$eval("#aufnahme-form .field-error:not([hidden])", (e) => e.length);
  check("Aufnahmeformular: Pflichtfelder geprüft", e3 === 4, String(e3));
  await page.fill("#b-name", "Prof. Dr. Anna Beispiel");
  await page.fill("#b-inst", "Universität Beispielstadt");
  await page.fill("#b-email", "anna@beispiel.de");
  await page.selectOption("#b-fach", "recht");
  await page.click("#aufnahme-form button[type=submit]");
  check("Aufnahmeformular: Bestätigung", /Vielen Dank/.test(await page.textContent(".confirm")));

  // #aufnahme springt zum Formular
  await go(page, "start");
  await page.click('a[href="#aufnahme"]');
  await page.waitForSelector("#aufnahme-form");
  await page.waitForTimeout(100);
  const top = await page.$eval("#aufnahme", (e) => e.getBoundingClientRect().top);
  check("„Aufnahme anfragen“ springt zum Formular", top < 200 && top > -20, String(top));

  // Tastaturbedienung: Skip-Link und sichtbarer Fokus
  await go(page, "start", true);
  await page.keyboard.press("Tab");
  check("Erster Tab erreicht „Zum Inhalt springen“", (await page.evaluate(() => document.activeElement.textContent)) === "Zum Inhalt springen");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check("Fokus ist sichtbar", outline !== "none", outline);

  // Formularfelder beschriftet
  for (const r of ["profil-clara-venhoff", "fuer-professoren", "suche", "start"]) {
    await go(page, r);
    const unl = await page.evaluate(() => Array.from(document.querySelectorAll("input:not([type=radio]), select, textarea")).filter((c) => !document.querySelector('label[for="' + c.id + '"]')).map((c) => c.id));
    check(`Alle Formularfelder beschriftet (${r})`, unl.length === 0, unl.join(","));
  }

  // Mobile Anfrageleiste
  await ctx.close();
  {
    const { ctx: c2, page: p2 } = await newPage(390, "light");
    await go(p2, "profil-clara-venhoff");
    await p2.waitForTimeout(300);
    const atTop = await p2.$eval("#mobilebar", (b) => b.classList.contains("is-hidden"));
    check("Handy: Leiste ist oben ausgeblendet, solange der Kopf-Button sichtbar ist", atTop);
    await p2.evaluate(() => document.querySelector("#vita-h").scrollIntoView());
    await p2.waitForTimeout(400);
    const visible = await p2.$eval("#mobilebar", (b) => !b.hidden && !b.classList.contains("is-hidden"));
    check("Handy: Anfrage-Button beim Scrollen dauerhaft unten sichtbar", visible);
    await p2.click("#mobilebar button");
    await p2.waitForTimeout(900);
    const hidden = await p2.$eval("#mobilebar", (b) => b.classList.contains("is-hidden"));
    check("Handy: Leiste blendet sich am Formular aus", hidden);
    await go(p2, "start");
    check("Handy: Leiste nur auf Profilseiten", await p2.$eval("#mobilebar", (b) => b.hidden));
    await c2.close();
  }

  // Bewegung reduzieren
  {
    const ctx3 = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1180, height: 820 } });
    const p3 = await ctx3.newPage();
    await p3.goto(BASE + "#start");
    const sb = await p3.evaluate(() => getComputedStyle(document.querySelector(".btn")).transitionDuration);
    check("„Bewegung reduzieren“ wird respektiert", sb === "0s", sb);
    await ctx3.close();
  }

  // Fotos: mit Testbild wird das Foto gezeigt, bei fehlender Datei erscheinen die Initialen
  {
    const ctx4 = await browser.newContext({ viewport: { width: 1180, height: 820 } });
    const p4 = await ctx4.newPage();
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="#888"/><circle cx="400" cy="380" r="160" fill="#ccc"/></svg>';
    await p4.route("**/assets/profiles.js", async (route) => {
      const body = fs.readFileSync(path.join(ROOT, "assets/profiles.js"), "utf8") +
        '\nwindow.PROFILES[0].foto="assets/portraits/test.svg";window.PROFILES[0].fotoNachweis="Testbild";window.PROFILES[1].foto="assets/portraits/fehlt.jpg";';
      await route.fulfill({ contentType: "text/javascript", body });
    });
    await p4.route("**/assets/portraits/test.svg", (route) => route.fulfill({ contentType: "image/svg+xml", body: svg }));
    await p4.goto(BASE + "#profil-clara-venhoff");
    await p4.waitForSelector(".p-pic img");
    await p4.waitForFunction(() => document.querySelector(".p-pic img").complete);
    const ok = await p4.evaluate(() => {
      const img = document.querySelector(".p-pic img");
      return img.naturalWidth > 0 && getComputedStyle(document.querySelector(".p-pic .portrait > span")).display === "none" && /Symbolfoto/.test(img.alt);
    });
    check("Foto wird im Profil angezeigt (Initialen ausgeblendet, Alternativtext vorhanden)", ok);
    await p4.screenshot({ path: path.join(SHOTS, "foto-test.png") });
    await p4.goto(BASE + "#profil-matthias-ohlendorf");
    await p4.waitForTimeout(400);
    const fb = await p4.evaluate(() => !document.querySelector(".p-pic img") && !document.querySelector(".p-pic .portrait").classList.contains("has-photo"));
    check("Fehlende Bilddatei fällt sauber auf Initialen zurück", fb);
    await p4.goto(BASE + "#impressum");
    check("Bildnachweis erscheint im Impressum", /Testbild/.test(await p4.textContent("#main")));
    await ctx4.close();
  }

  check("Keine Fehler in der Browser-Konsole", consoleErrors.length === 0, consoleErrors.slice(0, 5).join(" | "));

  await browser.close();
  server.close();

  const failed = results.filter((r) => !r.ok);
  results.forEach((r) => { if (!r.ok) console.log("FEHLER  " + r.name + (r.detail ? "  → " + r.detail : "")); });
  console.log(`\n${results.length - failed.length}/${results.length} Prüfungen bestanden`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
