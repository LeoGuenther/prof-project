# Professorium – Klick-Prototyp

Kuratiertes Portal, auf dem ausgewählte Professorinnen und Professoren eine hochwertige,
uni-unabhängige Profilseite bekommen. Veranstalter, Unternehmen und Medien finden sie
dort nach Themen und fragen sie an. Alle Profile im Prototyp sind **fiktiv**.

## Ansehen

- Lokal: `index.html` im Browser öffnen (kein Server nötig).
- Teilbarer Link: wird als Artifact aus `artifact.html` veröffentlicht.

Seiten und ihre Adressen:

| Seite | Adresse |
|---|---|
| Startseite | `#start` |
| Suche mit Filtern | `#suche` |
| Profil | `#profil-<slug>`, z. B. `#profil-clara-venhoff` (Vorzeigeprofil) |
| Für Professoren | `#fuer-professoren` (direkt zum Formular: `#aufnahme`) |
| Impressum / Datenschutz | `#impressum`, `#datenschutz` |

## Aufbau

```
index.html          Seite für Browser und spätere Website
artifact.html       Gleiche Seite für den teilbaren Artifact-Link
assets/config.js    Name, Domain, Claim, Kontaktadresse, Antwortzeit
assets/profiles.js  ALLE Inhalte: Fachgebiete, Formate, aktuelle Themen, Profile
assets/styles.css   Gestaltung; Farben und Schriften als Variablen ganz oben
assets/app.js       Seiten, Suche, Filter, Formulare (keine Inhalte)
tests/check.js      Automatische Prüfung (416 Einzelprüfungen)
tools/portraits.py  Bereitet Porträtfotos auf (Zuschnitt 4:5, Größe)
```

## Ein Profil hinzufügen

In `assets/profiles.js` einen neuen Eintrag in `window.PROFILES` anlegen, am einfachsten
durch Kopieren eines bestehenden Eintrags. Wichtig:

- `slug` ist die Adresse (`#profil-<slug>`) und muss eindeutig sein.
- `fach` muss ein `key` aus `FACHGEBIETE` sein.
- `formate` nur aus `FORMATE`; `modus` enthält `"online"` und/oder `"vor-ort"`.
- `stichworte` verbessern die Suche (z. B. Synonyme wie „KI“ und „künstliche intelligenz“).
- `hervorgehoben: true` zeigt das Profil oben auf der Startseite (max. 4).

Neue Fachgebiete, Regionen und Sprachen erscheinen automatisch in den Filtern.

## Fotos einbinden

1. Originalfotos nach `fotos-original/<slug>.jpg` legen (z. B. `clara-venhoff.jpg`).
2. `python3 tools/portraits.py` ausführen. Das Skript schneidet auf 4:5 zu und speichert
   nach `assets/portraits/<slug>.jpg` (800 × 1000 px).
3. Im Profil in `assets/profiles.js` ergänzen:
   `foto: "assets/portraits/<slug>.jpg", fotoNachweis: "Fotograf/in, Quelle, Lizenz"`

Alle Fotos werden einheitlich schwarz-weiß mit Tintenblau getönt (`styles.css`, Abschnitt
„Foto-Behandlung“). Fehlt eine Datei, zeigt das Profil automatisch die Initialen. Bildnachweise
erscheinen automatisch im Impressum. Symbolfotos fremder Personen nur mit Lizenz, die diese
Nutzung erlaubt, und immer als „Symbolfoto“ gekennzeichnet.

## Den Namen ändern

In `assets/config.js` den Wert `name` ändern. Zusätzlich das `<title>`-Tag in `index.html`
und `artifact.html` anpassen (wird für Linkvorschauen gebraucht, bevor JavaScript läuft).

## Prüfen

```bash
node tests/check.js
```

Prüft Darstellung bei 390, 820, 1180 und 1440 px (hell und dunkel), Überlauf, Touch-Ziele,
alle Links, Suche, Filter, Formulare, Zurück-Button, Tastaturbedienung und Konsolenfehler.
Benötigt Playwright mit Chromium. Screenshots landen in `tests/shots/`.

## Bewusste Grenzen des Prototyps

- Kein Backend: Formulare prüfen Eingaben und bestätigen, versenden aber nichts.
- Porträts sind Platzhalter, bis Fotos eingelegt werden. Das Video ist ein Platzhalter.
- Schriften kommen von Google Fonts; für den Echtbetrieb lokal einbinden (DSGVO).
- Impressum und Datenschutz sind Platzhalter und müssen vor dem Start ersetzt werden.
