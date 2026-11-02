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
tests/check.js      Automatische Prüfung (405 Einzelprüfungen)
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
- Porträts und Video sind gestaltete Platzhalter.
- Schriften kommen von Google Fonts; für den Echtbetrieb lokal einbinden (DSGVO).
- Impressum und Datenschutz sind Platzhalter und müssen vor dem Start ersetzt werden.
