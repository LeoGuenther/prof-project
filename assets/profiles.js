/*
 * Alle Inhalte des Portals an einer Stelle.
 * Ein neues Profil = ein neuer Eintrag in PROFILES (siehe README).
 * Fotos: optional die Felder  foto: "assets/portraits/<slug>.jpg"  und
 *        fotoNachweis: "Fotograf/in, Quelle, Lizenz"  ergänzen (siehe tools/portraits.py).
 *        Ohne Foto zeigt das Profil automatisch die Initialen.
 * Alle Personen sind FIKTIV. Ähnlichkeiten mit realen Personen sind nicht beabsichtigt.
 */

window.FACHGEBIETE = [
  { key: "ki", label: "KI & Informatik", beschreibung: "Künstliche Intelligenz, IT-Sicherheit, Digitalisierung" },
  { key: "medizin", label: "Medizin", beschreibung: "Gesundheit, Prävention, Altern, Schlaf" },
  { key: "recht", label: "Recht", beschreibung: "Digitalrecht, Haftung, Verträge, Daten" },
  { key: "wirtschaft", label: "Wirtschaft", beschreibung: "Finanzen, Nachhaltigkeit, Risiko" },
  { key: "psychologie", label: "Psychologie", beschreibung: "Entscheidungen, Resilienz, Lernen" },
  { key: "geschichte", label: "Geschichte", beschreibung: "Zeitgeschichte, Erinnerung, Jubiläen" }
];

window.FORMATE = ["Keynote", "Workshop", "Podium", "Beratung", "Gutachten", "Interview"];

window.AKTUELLE_THEMEN = [
  { label: "KI im Recht", q: "KI Recht", zeile: "Was sich für Kanzleien und Gerichte ändert" },
  { label: "Gesundheit im Alter", q: "Gesundheit Alter", zeile: "Gesund und selbstständig älter werden" },
  { label: "Cyberangriffe", q: "Cyberangriffe", zeile: "Wie sich Unternehmen schützen" },
  { label: "Nachhaltige Finanzen", q: "Nachhaltig", zeile: "ESG ohne Greenwashing" },
  { label: "Entscheiden unter Druck", q: "Entscheiden", zeile: "Gute Entscheidungen bei Unsicherheit" },
  { label: "Erinnerungskultur", q: "Erinnerungskultur", zeile: "Erinnern, wenn die Zeitzeugen fehlen" },
  { label: "Schlaf und Leistung", q: "Schlaf", zeile: "Die unterschätzte Ressource" },
  { label: "Resilienz", q: "Resilienz", zeile: "Was Menschen in Krisen stärkt" }
];

window.PROFILES = [
  {
    slug: "clara-venhoff",
    titel: "Prof. Dr.",
    vorname: "Clara",
    nachname: "Venhoff",
    kurz: "Prof. Venhoff",
    fach: "ki",
    professur: "Professur für Ethik der Informationstechnologie",
    institution: "Universität zu Köln",
    ort: "Köln",
    region: "Nordrhein-Westfalen",
    land: "Deutschland",
    status: "aktiv",
    hervorgehoben: true,
    vorzeige: true,
    geprueft: "Oktober 2026",
    kurzbio: "Clara Venhoff forscht dazu, wie Künstliche Intelligenz Entscheidungen in Unternehmen, Verwaltung und Medizin verändert und wer dafür die Verantwortung trägt. Sie übersetzt ethische Grundsatzfragen in klare Leitlinien für die Praxis. Ihre Vorträge verbinden aktuelle Forschung mit Beispielen, die jedes Publikum aus dem eigenen Alltag kennt.",
    themen: [
      { titel: "Wer haftet, wenn die Maschine entscheidet?", text: "Ein Überblick über Verantwortung bei KI-gestützten Entscheidungen, vom Kreditantrag bis zur Diagnose. Mit konkreten Leitfragen, die Führungskräfte sofort anwenden können.", dauer: "45 Min." },
      { titel: "KI im Unternehmen verantwortungsvoll einführen", text: "Wie Organisationen KI-Projekte so aufsetzen, dass Beschäftigte, Kundschaft und Aufsicht mitgehen. Grundlage sind Erfahrungen aus über 30 Praxisprojekten.", dauer: "Workshop, halbtägig" },
      { titel: "Fairness lässt sich nicht programmieren. Oder doch?", text: "Warum Algorithmen diskriminieren können und welche technischen und organisatorischen Gegenmittel wirken. Verständlich auch ohne Vorwissen.", dauer: "30–45 Min." },
      { titel: "Die europäische KI-Verordnung in 30 Minuten", text: "Was der AI Act für Unternehmen und Behörden bedeutet, welche Pflichten gelten und wo es noch Spielräume gibt.", dauer: "30 Min." }
    ],
    formate: ["Keynote", "Workshop", "Podium", "Beratung", "Interview"],
    sprachen: ["Deutsch", "Englisch"],
    reisen: "Ab Köln, im gesamten deutschsprachigen Raum",
    modus: ["online", "vor-ort"],
    video: { titel: "Keynote „Wer haftet, wenn die Maschine entscheidet?“", anlass: "Rheinisches Digitalforum, Köln 2025", laenge: "4:12" },
    vita: [
      { zeit: "seit 2022", text: "Leitung der Forschungsstelle „Verantwortliche KI“, Universität zu Köln" },
      { zeit: "seit 2016", text: "Professur für Ethik der Informationstechnologie, Universität zu Köln" },
      { zeit: "2010–2016", text: "Juniorprofessur für Technikethik, Universität Bonn" },
      { zeit: "2007–2010", text: "Wissenschaftliche Mitarbeiterin, University of Edinburgh" },
      { zeit: "2006", text: "Promotion in Philosophie, Technische Universität Darmstadt" },
      { zeit: "1996–2002", text: "Studium der Philosophie und Informatik in Tübingen" }
    ],
    publikationen: [
      { jahr: "2024", titel: "Entscheiden lassen. Verantwortung im Zeitalter lernender Maschinen", details: "Sachbuch, C.H.Beck" },
      { jahr: "2021", titel: "Ethik für Entwicklerinnen und Entwickler. Ein Leitfaden für die Praxis", details: "Fachbuch, Springer Vieweg" },
      { jahr: "2019", titel: "Fairness by Design? Grenzen algorithmischer Gleichbehandlung", details: "Fachaufsatz, Zeitschrift für Ethik und Moralphilosophie" },
      { jahr: "2017", titel: "Maschinen, die urteilen", details: "Herausgeberin, Sammelband" }
    ],
    medien: [
      { art: "Radio", titel: "Gespräch über die europäische KI-Verordnung im Kulturprogramm", jahr: "2025" },
      { art: "Podcast", titel: "Gast im Wissenschaftspodcast „Morgen verstehen“", jahr: "2025" },
      { art: "Zeitung", titel: "Interview „Die KI ist nie schuld“ in einer überregionalen Tageszeitung", jahr: "2024" },
      { art: "Fernsehen", titel: "Expertin in einer Dokumentation über Algorithmen im Alltag", jahr: "2023" }
    ],
    referenzen: [
      "Rheinisches Digitalforum, Köln (2025)",
      "Jahrestagung eines Versicherungsverbands, Düsseldorf (2025)",
      "Führungskräftetagung eines Automobilzulieferers (2024)",
      "Fortbildung für Landesbehörden zum Einsatz von KI, Münster (2024)",
      "Podium beim Ethikrat einer Universitätsklinik (2023)"
    ],
    stichworte: ["künstliche intelligenz", "ki", "ethik", "verantwortung", "ai act", "ki-verordnung", "digitalisierung", "algorithmen", "fairness", "haftung", "verwaltung"]
  },
  {
    slug: "matthias-ohlendorf",
    titel: "Prof. Dr. med.",
    vorname: "Matthias",
    nachname: "Ohlendorf",
    kurz: "Prof. Ohlendorf",
    fach: "medizin",
    professur: "Professur für Geriatrie und Altersmedizin",
    institution: "Universitätsklinikum Hamburg-Eppendorf",
    ort: "Hamburg",
    region: "Hamburg",
    land: "Deutschland",
    status: "aktiv",
    hervorgehoben: true,
    vorzeige: false,
    geprueft: "September 2026",
    kurzbio: "Matthias Ohlendorf ist Altersmediziner und leitet eine geriatrische Klinik in Hamburg. Er erklärt, was Menschen selbst tun können, um gesund und selbstständig älter zu werden, und wie Arbeitgeber ältere Beschäftigte und pflegende Angehörige unterstützen. Er spricht klar, ohne Fachjargon und mit viel Erfahrung aus dem Klinikalltag.",
    themen: [
      { titel: "Gesund älter werden: Was wirklich hilft", text: "Bewegung, Ernährung, soziale Kontakte: Was die Forschung über gesundes Altern weiß und welche Ratschläge man getrost vergessen kann.", dauer: "45 Min." },
      { titel: "Beruf und Pflege vereinbaren", text: "Viele Beschäftigte pflegen nebenbei Angehörige. Der Vortrag zeigt, wie Arbeitgeber mit wenig Aufwand spürbar entlasten können.", dauer: "30–45 Min." },
      { titel: "Demenz verstehen", text: "Wie sich eine Demenz äußert, was Angehörige tun können und wo die Forschung heute steht. Für Laien wie für Fachpublikum geeignet.", dauer: "60 Min." },
      { titel: "Arbeiten mit 60 plus", text: "Wie sich die Leistungsfähigkeit im Alter verändert und warum Teams davon profitieren, wenn erfahrene Beschäftigte länger bleiben.", dauer: "45 Min." }
    ],
    formate: ["Keynote", "Podium", "Beratung", "Interview"],
    sprachen: ["Deutsch", "Englisch"],
    reisen: "Ab Hamburg, deutschlandweit",
    modus: ["online", "vor-ort"],
    video: { titel: "Vortrag „Gesund älter werden“", anlass: "Gesundheitstag einer Krankenkasse, Hamburg 2025", laenge: "3:48" },
    vita: [
      { zeit: "seit 2014", text: "Professur für Geriatrie und Altersmedizin sowie Klinikleitung, Universitätsklinikum Hamburg-Eppendorf" },
      { zeit: "2008–2014", text: "Oberarzt der Klinik für Geriatrie, Universitätsklinikum Münster" },
      { zeit: "2007", text: "Habilitation in Innerer Medizin, Universität Münster" },
      { zeit: "1999", text: "Promotion zum Dr. med., Universität Göttingen" },
      { zeit: "1992–1999", text: "Studium der Humanmedizin in Göttingen und Wien" }
    ],
    publikationen: [
      { jahr: "2023", titel: "Jung bleiben ist keine Altersfrage. Was die Medizin über gesundes Altern weiß", details: "Sachbuch, Kösel" },
      { jahr: "2020", titel: "Praxisleitfaden Geriatrie", details: "Herausgeber, Fachbuch, Thieme" },
      { jahr: "2018", titel: "Mobilität im hohen Alter erhalten", details: "Übersichtsartikel, Fachzeitschrift für Innere Medizin" }
    ],
    medien: [
      { art: "Fernsehen", titel: "Expertengespräch in einem Gesundheitsmagazin", jahr: "2025" },
      { art: "Podcast", titel: "„Älter werden, aber richtig“, Folge 12", jahr: "2024" },
      { art: "Zeitung", titel: "Interview zur Pflege von Angehörigen in einer Hamburger Tageszeitung", jahr: "2024" }
    ],
    referenzen: [
      "Gesundheitstag einer gesetzlichen Krankenkasse, Hamburg (2025)",
      "Personalleitertreffen eines Industrieverbands, Bremen (2025)",
      "Seniorenakademie einer Volkshochschule, Lübeck (2024)",
      "Fachkongress „Pflege und Gesellschaft“, Berlin (2023)"
    ],
    stichworte: ["gesundheit", "alter", "altern", "demenz", "pflege", "pflegende angehörige", "prävention", "geriatrie", "demografie", "bewegung", "ältere beschäftigte"]
  },
  {
    slug: "miriam-achterberg",
    titel: "Prof. Dr.",
    vorname: "Miriam",
    nachname: "Achterberg",
    kurz: "Prof. Achterberg",
    fach: "recht",
    professur: "Lehrstuhl für Bürgerliches Recht und Recht der Digitalisierung",
    institution: "Ludwig-Maximilians-Universität München",
    ort: "München",
    region: "Bayern",
    land: "Deutschland",
    status: "aktiv",
    hervorgehoben: true,
    vorzeige: false,
    geprueft: "Oktober 2026",
    kurzbio: "Miriam Achterberg verbindet Zivilrecht mit den Fragen der digitalen Wirtschaft: Wem gehören Daten, wer haftet für Software, und wie verändert KI die Arbeit von Kanzleien und Gerichten? Sie berät Unternehmen und Ministerien und erklärt komplexe Rechtslagen so, dass auch Nicht-Juristen sie verstehen.",
    themen: [
      { titel: "KI im Recht: Was sich für Kanzleien und Gerichte ändert", text: "Welche Aufgaben KI in der Rechtsarbeit heute schon übernimmt, wo die Grenzen liegen und was das für Ausbildung und Haftung bedeutet.", dauer: "45 Min." },
      { titel: "Wem gehören die Daten?", text: "Der europäische Data Act und was er für Hersteller vernetzter Geräte und ihre Kundschaft bedeutet.", dauer: "30–45 Min." },
      { titel: "Verträge, die Maschinen schließen", text: "Wenn Software selbstständig bestellt, bucht oder verhandelt: Wer ist Vertragspartner, und wer haftet bei Fehlern?", dauer: "45 Min." },
      { titel: "Digitalrecht für den Mittelstand", text: "Die wichtigsten Pflichten aus Datenschutz, Data Act und KI-Verordnung, kompakt aufbereitet für Geschäftsführung und Fachabteilungen.", dauer: "Workshop, halbtägig" }
    ],
    formate: ["Keynote", "Workshop", "Podium", "Beratung", "Gutachten"],
    sprachen: ["Deutsch", "Englisch"],
    reisen: "Ab München, im gesamten deutschsprachigen Raum",
    modus: ["online", "vor-ort"],
    video: { titel: "Keynote „KI im Recht“", anlass: "Anwaltstag eines Landesverbands, Nürnberg 2025", laenge: "5:02" },
    vita: [
      { zeit: "seit 2019", text: "Lehrstuhl für Bürgerliches Recht und Recht der Digitalisierung, LMU München" },
      { zeit: "2015–2019", text: "Professur für Wirtschaftsrecht, Universität Passau" },
      { zeit: "2014", text: "Habilitation, Universität Freiburg" },
      { zeit: "2010", text: "Zweites juristisches Staatsexamen, Baden-Württemberg" },
      { zeit: "2008", text: "Promotion, Universität Freiburg" },
      { zeit: "2001–2006", text: "Studium der Rechtswissenschaft in Freiburg und Paris" }
    ],
    publikationen: [
      { jahr: "2025", titel: "Recht für Algorithmen. Haftung und Verantwortung in der digitalen Wirtschaft", details: "Fachbuch, Mohr Siebeck" },
      { jahr: "2024", titel: "Data Act. Handkommentar", details: "Mitherausgeberin, Nomos" },
      { jahr: "2020", titel: "Der Vertrag mit dem Software-Agenten", details: "Fachaufsatz, juristische Fachzeitschrift" }
    ],
    medien: [
      { art: "Radio", titel: "Gespräch über KI in der Justiz", jahr: "2025" },
      { art: "Podcast", titel: "Fachpodcast „Recht digital“, Folge zum Data Act", jahr: "2024" },
      { art: "Zeitung", titel: "Gastbeitrag zum Data Act in einer Wirtschaftszeitung", jahr: "2024" }
    ],
    referenzen: [
      "Kanzleitag einer internationalen Wirtschaftskanzlei, Frankfurt (2025)",
      "Jahrestagung eines Verbands der Digitalwirtschaft, Berlin (2025)",
      "Richterfortbildung zum Einsatz von KI, Trier (2024)",
      "Mittelstandsforum einer Industrie- und Handelskammer, Nürnberg (2024)"
    ],
    stichworte: ["recht", "ki", "künstliche intelligenz", "data act", "datenrecht", "haftung", "verträge", "digitalisierung", "kanzlei", "justiz", "mittelstand", "ki-verordnung", "datenschutz"]
  },
  {
    slug: "nora-gasser-imhof",
    titel: "Prof. Dr.",
    vorname: "Nora",
    nachname: "Gasser-Imhof",
    kurz: "Prof. Gasser-Imhof",
    fach: "wirtschaft",
    professur: "Professur für Nachhaltige Finanzwirtschaft",
    institution: "Universität St. Gallen",
    ort: "St. Gallen",
    region: "Schweiz",
    land: "Schweiz",
    status: "aktiv",
    hervorgehoben: true,
    vorzeige: false,
    geprueft: "August 2026",
    kurzbio: "Nora Gasser-Imhof forscht dazu, wie Kapital in nachhaltige Unternehmen fließt und wann Nachhaltigkeitsversprechen halten, was sie sagen. Vor ihrer Professur arbeitete sie mehrere Jahre im Risikomanagement einer Schweizer Bank. Sie spricht vor Finanzfachleuten ebenso überzeugend wie vor Familienunternehmen und Stiftungen.",
    themen: [
      { titel: "ESG ohne Greenwashing", text: "Woran man glaubwürdige Nachhaltigkeitsberichte erkennt und warum gute Ratings allein nicht ausreichen.", dauer: "45 Min." },
      { titel: "Klimarisiken gehören in die Bilanz", text: "Wie Hitze, Hochwasser und CO₂-Preise den Wert von Unternehmen verändern und wie Finanzabteilungen das messen können.", dauer: "45 Min." },
      { titel: "Nachhaltig investieren: Was bringt es wirklich?", text: "Ein nüchterner Blick auf Rendite und Wirkung nachhaltiger Geldanlagen, für Stiftungen, Familienvermögen und Privatanlegende.", dauer: "30–45 Min." }
    ],
    formate: ["Keynote", "Podium", "Beratung", "Interview"],
    sprachen: ["Deutsch", "Englisch", "Französisch"],
    reisen: "Ab St. Gallen, im deutschsprachigen Raum und europaweit",
    modus: ["online", "vor-ort"],
    video: { titel: "Podiumsbeitrag „Klimarisiken gehören in die Bilanz“", anlass: "Finanzforum am Bodensee, 2025", laenge: "4:30" },
    vita: [
      { zeit: "seit 2020", text: "Professur für Nachhaltige Finanzwirtschaft, Universität St. Gallen" },
      { zeit: "2016–2020", text: "Assistenzprofessorin für Banking und Finance, Universität Zürich" },
      { zeit: "2011–2016", text: "Risikomanagement bei einer Schweizer Bank, Zürich" },
      { zeit: "2011", text: "Promotion in Finance, Universität Zürich" },
      { zeit: "2002–2007", text: "Studium der Volkswirtschaftslehre in Bern und Lausanne" }
    ],
    publikationen: [
      { jahr: "2024", titel: "Grünes Geld. Wie nachhaltige Finanzen funktionieren und wo sie scheitern", details: "Sachbuch, NZZ Libro" },
      { jahr: "2021", titel: "Klimarisiken und Unternehmensbewertung", details: "Fachaufsatz, internationale Finanzfachzeitschrift" },
      { jahr: "2019", titel: "Leitfaden Klimarisiken für Pensionskassen", details: "Studie im Auftrag eines Branchenverbands" }
    ],
    medien: [
      { art: "Fernsehen", titel: "Gesprächsgast zu nachhaltigen Geldanlagen", jahr: "2025" },
      { art: "Podcast", titel: "Wirtschaftspodcast „Geld und Wirkung“", jahr: "2024" },
      { art: "Zeitung", titel: "Interview in einer Schweizer Wirtschaftszeitung", jahr: "2024" }
    ],
    referenzen: [
      "Jahreskonferenz eines Pensionskassenverbands, Zürich (2025)",
      "Familienunternehmertag, Stuttgart (2025)",
      "Stiftungsforum, Wien (2024)",
      "Strategietagung einer Kantonalbank (2024)"
    ],
    stichworte: ["wirtschaft", "finanzen", "nachhaltigkeit", "nachhaltig", "esg", "greenwashing", "klima", "klimarisiken", "geldanlage", "investieren", "stiftungen", "banken"]
  },
  {
    slug: "ingrid-sommerfeld",
    titel: "Prof. em. Dr. Dr. h. c.",
    vorname: "Ingrid",
    nachname: "Sommerfeld",
    kurz: "Prof. Sommerfeld",
    fach: "psychologie",
    professur: "Emeritierte Professorin für Allgemeine Psychologie",
    institution: "Universität Heidelberg",
    ort: "Heidelberg",
    region: "Baden-Württemberg",
    land: "Deutschland",
    status: "emeritiert",
    hervorgehoben: false,
    vorzeige: false,
    geprueft: "Juli 2026",
    kurzbio: "Ingrid Sommerfeld hat über drei Jahrzehnte erforscht, wie Menschen unter Zeitdruck und Unsicherheit entscheiden. Seit ihrer Emeritierung widmet sie sich ganz dem Austausch mit Praxis und Öffentlichkeit. Ihre Vorträge sind ruhig, präzise und voller Beispiele aus Medizin, Luftfahrt und Wirtschaft.",
    themen: [
      { titel: "Gut entscheiden, wenn es eng wird", text: "Was Pilotinnen, Notärzte und Führungskräfte gemeinsam haben, wenn Zeit und Informationen knapp sind, und welche einfachen Regeln dann helfen.", dauer: "45–60 Min." },
      { titel: "Resilienz: Was uns in Krisen stärkt", text: "Welche Faktoren Menschen und Teams widerstandsfähig machen. Ohne Ratgeberklischees, auf Grundlage gesicherter Forschung.", dauer: "45 Min." },
      { titel: "Lernen hört nie auf", text: "Wie sich Gedächtnis und Denken im Laufe des Lebens verändern und wie man bis ins hohe Alter geistig beweglich bleibt.", dauer: "45 Min." }
    ],
    formate: ["Keynote", "Podium", "Interview"],
    sprachen: ["Deutsch", "Englisch"],
    reisen: "Ab Heidelberg, in Süddeutschland, sonst online",
    modus: ["online", "vor-ort"],
    video: { titel: "Vortrag „Gut entscheiden, wenn es eng wird“", anlass: "Führungskräftetagung eines Klinikverbunds, Mannheim 2024", laenge: "6:15" },
    vita: [
      { zeit: "seit 2021", text: "Emeritiert, weiterhin Lehr- und Vortragstätigkeit" },
      { zeit: "2019", text: "Ehrendoktorwürde der Universität Bern" },
      { zeit: "1997–2021", text: "Professur für Allgemeine Psychologie, Universität Heidelberg" },
      { zeit: "1989–1997", text: "Wissenschaftliche Mitarbeiterin und Habilitation, Max-Planck-Institut für Bildungsforschung, Berlin" },
      { zeit: "1988", text: "Promotion in Psychologie, Universität Mannheim" },
      { zeit: "1981–1986", text: "Studium der Psychologie in Mannheim und Bristol" }
    ],
    publikationen: [
      { jahr: "2022", titel: "Entscheiden unter Druck. Was wir von Pilotinnen und Notärzten lernen können", details: "Sachbuch, Klett-Cotta" },
      { jahr: "2014", titel: "Allgemeine Psychologie: Denken und Entscheiden", details: "Lehrbuch, Hogrefe" },
      { jahr: "2008", titel: "Faustregeln im klinischen Alltag", details: "Fachaufsatz, psychologische Fachzeitschrift" }
    ],
    medien: [
      { art: "Radio", titel: "Gespräch über Entscheidungen in Krisenzeiten", jahr: "2025" },
      { art: "Podcast", titel: "Wissenschaftspodcast, Folge „Bauchgefühl“", jahr: "2024" }
    ],
    referenzen: [
      "Führungskräftetagung eines Klinikverbunds, Mannheim (2024)",
      "Sicherheitstag einer Fluggesellschaft, Frankfurt (2024)",
      "Bankentag eines Sparkassenverbands, Stuttgart (2023)",
      "Seniorenstudium einer Universität (2023)"
    ],
    stichworte: ["psychologie", "entscheidungen", "entscheiden", "resilienz", "krisen", "stress", "lernen", "gedächtnis", "alter", "führung", "bauchgefühl"]
  },
  {
    slug: "ansgar-tellkamp",
    titel: "Prof. Dr.",
    vorname: "Ansgar",
    nachname: "Tellkamp",
    kurz: "Prof. Tellkamp",
    fach: "geschichte",
    professur: "Professur für Neuere und Zeitgeschichte",
    institution: "Universität Leipzig",
    ort: "Leipzig",
    region: "Sachsen",
    land: "Deutschland",
    status: "aktiv",
    hervorgehoben: false,
    vorzeige: false,
    geprueft: "September 2026",
    kurzbio: "Ansgar Tellkamp erzählt Geschichte so, dass sie im Gedächtnis bleibt. Er forscht zur deutschen Teilung, zur Wiedervereinigung und dazu, wie Gesellschaften sich erinnern. Unternehmen und Städte begleitet er bei Jubiläen und bei der Aufarbeitung ihrer eigenen Vergangenheit.",
    themen: [
      { titel: "1989/90: Wie die Einheit gemacht wurde", text: "Die entscheidenden Monate zwischen Mauerfall und Wiedervereinigung, erzählt aus der Sicht der Menschen, die sie erlebt haben.", dauer: "45–60 Min." },
      { titel: "Was Geschichte über Krisen lehrt", text: "Inflation, Umbrüche, Neuanfänge: Was Verantwortliche heute aus früheren Krisen lernen können und wo historische Vergleiche hinken.", dauer: "45 Min." },
      { titel: "Erinnerungskultur heute", text: "Wie wir an Diktatur und Krieg erinnern, wenn die letzten Zeitzeugen sterben, und welche Rolle Schulen, Museen und soziale Medien dabei spielen.", dauer: "45 Min." },
      { titel: "Unternehmensgeschichte erzählen", text: "Wie Unternehmen ein Jubiläum nutzen, um ihre Geschichte ehrlich und spannend zu erzählen, auch die schwierigen Kapitel.", dauer: "Workshop, halbtägig" }
    ],
    formate: ["Keynote", "Workshop", "Podium", "Beratung", "Gutachten", "Interview"],
    sprachen: ["Deutsch", "Englisch", "Polnisch"],
    reisen: "Ab Leipzig, deutschlandweit",
    modus: ["online", "vor-ort"],
    video: { titel: "Festvortrag „1989/90: Wie die Einheit gemacht wurde“", anlass: "Festakt einer sächsischen Stadt, 2024", laenge: "5:40" },
    vita: [
      { zeit: "seit 2015", text: "Professur für Neuere und Zeitgeschichte, Universität Leipzig" },
      { zeit: "2012–2015", text: "Wissenschaftlicher Leiter einer Gedenkstätte, Berlin" },
      { zeit: "2011", text: "Habilitation, Humboldt-Universität zu Berlin" },
      { zeit: "2004", text: "Promotion in Geschichte, Universität Bielefeld" },
      { zeit: "1995–2001", text: "Studium der Geschichte und Slavistik in Bielefeld und Krakau" }
    ],
    publikationen: [
      { jahr: "2024", titel: "Das Jahr dazwischen. Deutschland 1990", details: "Sachbuch, Ch. Links Verlag" },
      { jahr: "2019", titel: "Gedächtnisorte der Teilung", details: "Fachbuch, Wallstein" },
      { jahr: "2016", titel: "Firmenjubiläen und Geschichtsbewusstsein", details: "Fachaufsatz, Fachzeitschrift für Unternehmensgeschichte" }
    ],
    medien: [
      { art: "Fernsehen", titel: "Experte in einer Dokumentation zur Wiedervereinigung", jahr: "2025" },
      { art: "Radio", titel: "Gespräch zum Tag der Deutschen Einheit", jahr: "2024" },
      { art: "Podcast", titel: "Geschichtspodcast, Folge „Herbst 89“", jahr: "2024" }
    ],
    referenzen: [
      "Festakt einer sächsischen Stadt (2024)",
      "Lehrerfortbildung zur Erinnerungskultur, Dresden (2024)",
      "125-Jahr-Feier eines Maschinenbauunternehmens (2023)",
      "Jahrestagung eines Geschichtsvereins, Magdeburg (2023)"
    ],
    stichworte: ["geschichte", "zeitgeschichte", "ddr", "wiedervereinigung", "einheit", "1989", "1990", "mauerfall", "erinnerung", "erinnerungskultur", "jubiläum", "unternehmensgeschichte", "krisen"]
  },
  {
    slug: "lukas-pirchner",
    titel: "Hon.-Prof. Dr.",
    vorname: "Lukas",
    nachname: "Pirchner",
    kurz: "Prof. Pirchner",
    fach: "medizin",
    professur: "Honorarprofessor für Schlafmedizin",
    institution: "Medizinische Universität Wien",
    ort: "Wien",
    region: "Österreich",
    land: "Österreich",
    status: "honorar",
    hervorgehoben: false,
    vorzeige: false,
    geprueft: "Oktober 2026",
    kurzbio: "Lukas Pirchner leitet ein schlafmedizinisches Zentrum in Wien und lehrt als Honorarprofessor an der Medizinischen Universität Wien. Er zeigt, warum guter Schlaf die am meisten unterschätzte Ressource in Unternehmen ist und was jeder Einzelne dafür tun kann. Seine Vorträge sind lebendig, praxisnah und oft überraschend.",
    themen: [
      { titel: "Schlaf: die unterschätzte Ressource", text: "Was im Schlaf passiert, warum Schlafmangel Entscheidungen verschlechtert und welche Gewohnheiten wirklich helfen.", dauer: "45 Min." },
      { titel: "Schichtarbeit gesund gestalten", text: "Wie Betriebe Schichtpläne so gestalten, dass Gesundheit, Sicherheit und Leistung der Beschäftigten profitieren.", dauer: "Workshop, halbtägig" },
      { titel: "Müde Führungskräfte, schlechte Entscheidungen?", text: "Ein kompakter Impuls für Führungsteams über Erholung, Dienstreisen und ständige Erreichbarkeit.", dauer: "30 Min." }
    ],
    formate: ["Keynote", "Workshop", "Beratung", "Interview"],
    sprachen: ["Deutsch", "Englisch", "Italienisch"],
    reisen: "Ab Wien, in Österreich und Süddeutschland",
    modus: ["online", "vor-ort"],
    video: { titel: "Keynote „Schlaf: die unterschätzte Ressource“", anlass: "Gesundheitskongress eines Versicherers, Linz 2025", laenge: "3:55" },
    vita: [
      { zeit: "seit 2022", text: "Honorarprofessor für Schlafmedizin, Medizinische Universität Wien" },
      { zeit: "seit 2013", text: "Leiter eines schlafmedizinischen Zentrums, Wien" },
      { zeit: "2006–2013", text: "Facharzt an einer Universitätsklinik für Neurologie, Wien" },
      { zeit: "2004", text: "Promotion zum Dr. med. univ., Medizinische Universität Innsbruck" },
      { zeit: "1997–2004", text: "Studium der Humanmedizin in Innsbruck" }
    ],
    publikationen: [
      { jahr: "2023", titel: "Endlich ausgeschlafen. Ein Arzt erklärt den Schlaf", details: "Sachbuch, Brandstätter" },
      { jahr: "2020", titel: "Schichtarbeit und Gesundheit", details: "Fachaufsatz, medizinische Fachzeitschrift" },
      { jahr: "2018", titel: "Schlafstörungen erkennen und behandeln", details: "Praxisleitfaden, Fachbuch" }
    ],
    medien: [
      { art: "Fernsehen", titel: "Studiogast in einer Wissenschaftssendung", jahr: "2025" },
      { art: "Radio", titel: "Ratgebersendung zum Thema Schlaf", jahr: "2024" },
      { art: "Zeitschrift", titel: "Interview in einem Wirtschaftsmagazin", jahr: "2024" }
    ],
    referenzen: [
      "Gesundheitskongress eines Versicherers, Linz (2025)",
      "Sicherheitstag eines Logistikunternehmens, Graz (2024)",
      "Führungskräfteklausur einer Bank, Salzburg (2024)",
      "Betriebsrätekonferenz, Wien (2023)"
    ],
    stichworte: ["medizin", "schlaf", "gesundheit", "schichtarbeit", "müdigkeit", "erholung", "leistung", "stress", "führung", "arbeitsschutz", "neurologie"]
  },
  {
    slug: "deniz-aydemir",
    titel: "Prof. Dr.",
    vorname: "Deniz",
    nachname: "Aydemir",
    kurz: "Prof. Aydemir",
    fach: "ki",
    professur: "Lehrstuhl für IT-Sicherheit",
    institution: "Ruhr-Universität Bochum",
    ort: "Bochum",
    region: "Nordrhein-Westfalen",
    land: "Deutschland",
    status: "aktiv",
    hervorgehoben: false,
    vorzeige: false,
    geprueft: "Oktober 2026",
    kurzbio: "Deniz Aydemir erforscht, wie Angreifer in Unternehmensnetze gelangen und wie man sie aufhält. Er zeigt live, wie leicht Täuschung per E-Mail oder Telefon funktioniert, und macht IT-Sicherheit für Geschäftsführung und Belegschaft greifbar. Ein weiterer Schwerpunkt ist die Sicherheit von KI-Systemen.",
    themen: [
      { titel: "Cyberangriffe auf den Mittelstand", text: "Wie typische Angriffe ablaufen, was sie kosten und welche fünf Maßnahmen das Risiko am stärksten senken.", dauer: "45 Min." },
      { titel: "Der Mensch als Einfallstor: Social Engineering live", text: "Eine Live-Demonstration, wie Angreifer mit gefälschten Anrufen und E-Mails Vertrauen erschleichen, und wie Teams das erkennen.", dauer: "45–60 Min." },
      { titel: "Kann man KI hacken?", text: "Wie sich KI-Systeme manipulieren lassen, vom präparierten Bild bis zum Sprachmodell, und was Unternehmen dagegen tun können.", dauer: "30–45 Min." }
    ],
    formate: ["Keynote", "Workshop", "Beratung", "Gutachten", "Interview"],
    sprachen: ["Deutsch", "Englisch", "Türkisch"],
    reisen: "Ab Bochum, deutschlandweit",
    modus: ["online", "vor-ort"],
    video: { titel: "Live-Demonstration „Social Engineering“", anlass: "Sicherheitskonferenz eines Energieversorgers, Essen 2025", laenge: "4:47" },
    vita: [
      { zeit: "seit 2021", text: "Lehrstuhl für IT-Sicherheit, Ruhr-Universität Bochum" },
      { zeit: "2018–2021", text: "Juniorprofessur für Systemsicherheit, Universität des Saarlandes" },
      { zeit: "2016–2018", text: "Forschungsaufenthalt an der Carnegie Mellon University, Pittsburgh" },
      { zeit: "2016", text: "Promotion in Informatik, Technische Universität Darmstadt" },
      { zeit: "2006–2012", text: "Studium der Informatik an der Technischen Universität Dortmund" }
    ],
    publikationen: [
      { jahr: "2025", titel: "Angriff ist die beste Verteidigung? Ein Lagebild der IT-Sicherheit", details: "Sachbuch, dpunkt.verlag" },
      { jahr: "2023", titel: "Manipulierte Bilder, getäuschte Modelle: Angriffe auf KI in der Industrie", details: "Konferenzbeitrag, internationale Sicherheitskonferenz" },
      { jahr: "2020", titel: "Social Engineering im Mittelstand. Eine Befragung von 400 Unternehmen", details: "Studie" }
    ],
    medien: [
      { art: "Fernsehen", titel: "Live-Demonstration in einem Verbrauchermagazin", jahr: "2025" },
      { art: "Podcast", titel: "Technikpodcast, Folge über Phishing", jahr: "2024" },
      { art: "Zeitung", titel: "Interview zur Lage der IT-Sicherheit in einer Wirtschaftszeitung", jahr: "2024" }
    ],
    referenzen: [
      "Sicherheitskonferenz eines Energieversorgers, Essen (2025)",
      "Unternehmertag einer Industrie- und Handelskammer, Dortmund (2025)",
      "Führungskräftetagung einer Stadtverwaltung (2024)",
      "Kongress eines Verbands der Automobilzulieferer (2024)"
    ],
    stichworte: ["ki", "künstliche intelligenz", "it-sicherheit", "cybersicherheit", "cybersecurity", "cyberangriffe", "hacker", "angriffe", "phishing", "social engineering", "informatik", "mittelstand", "sicherheit"]
  }
];
