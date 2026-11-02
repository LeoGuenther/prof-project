#!/usr/bin/env python3
"""
Bereitet Porträtfotos für das Portal auf.

1. Originalfotos in den Ordner  fotos-original/  legen, Dateiname = slug des Profils,
   z. B.  fotos-original/clara-venhoff.jpg  (jpg, jpeg, png oder webp).
2. Ausführen:  python3 tools/portraits.py
3. Das Skript schneidet jedes Foto auf das Format 4:5 zu (Gesicht im oberen Drittel),
   verkleinert es auf 800 x 1000 Pixel und speichert es als  assets/portraits/<slug>.jpg .
4. In assets/profiles.js beim Profil ergänzen:
       foto: "assets/portraits/<slug>.jpg",
       fotoNachweis: "Name der Fotografin/des Fotografen, Quelle, Lizenz"

Die Schwarz-Weiß-Tönung passiert in der Gestaltung (styles.css), die Dateien bleiben farbig.
Benötigt Pillow:  pip install pillow
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "fotos-original"
OUT = ROOT / "assets" / "portraits"
SIZE = (800, 1000)  # 4:5


def prepare(path: Path) -> Path:
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    w, h = img.size
    target = SIZE[0] / SIZE[1]
    if w / h > target:  # zu breit: seitlich zuschneiden, mittig
        nw = int(h * target)
        left = (w - nw) // 2
        img = img.crop((left, 0, left + nw, h))
    else:  # zu hoch: oben mehr behalten (Gesicht sitzt meist oben)
        nh = int(w / target)
        top = int((h - nh) * 0.25)
        img = img.crop((0, top, w, top + nh))
    img = img.resize(SIZE, Image.LANCZOS)
    out = OUT / (path.stem + ".jpg")
    img.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    files = [p for p in sorted(SRC.glob("*")) if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
    if not files:
        print("Keine Fotos in", SRC)
        return
    for f in files:
        out = prepare(f)
        print(f"{f.name} -> {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")
        print(f'   foto: "assets/portraits/{f.stem}.jpg",')


if __name__ == "__main__":
    main()
