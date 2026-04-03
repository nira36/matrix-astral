"""
Crop tarot card images — removes outer frame, keeps inner card area (from dashed line inward).

Usage:
  python scripts/crop_cards.py --src CARTELLA_SORGENTE --dst public/deck --crop 42

  --src   cartella con le immagini originali (qualsiasi nome di file)
  --dst   cartella di destinazione (default: public/deck)
  --crop  pixel da tagliare su ogni lato (default: 42)
  --cropx pixel da tagliare sinistra/destra (sovrascrive --crop per l'asse X)
  --cropy pixel da tagliare sopra/sotto     (sovrascrive --crop per l'asse Y)
  --preview  mostra solo le dimensioni senza salvare
"""

import argparse
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Installa Pillow: pip install pillow")
    raise

SUPPORTED = {'.jpg', '.jpeg', '.png', '.webp'}

# Traditional tarot order — filename index → output name
ORDER = [
    "00", "01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12", "13", "14", "15",
    "16", "17", "18", "19", "20", "21",
]


def crop_image(src_path: Path, dst_path: Path, cropx: int, cropy: int, preview: bool) -> None:
    img = Image.open(src_path)
    w, h = img.size
    left   = cropx
    top    = cropy
    right  = w - cropx
    bottom = h - cropy

    if right <= left or bottom <= top:
        print(f"  ERR {src_path.name}: crop {crop}px troppo grande per {w}x{h}")
        return

    print(f"  {src_path.name}  {w}x{h}  ->  {right-left}x{bottom-top}", end="")

    if preview:
        print("  (preview, non salvato)")
        return

    cropped = img.crop((left, top, right, bottom))
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dst_path, quality=95)
    print(f"  ->  {dst_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--src",     required=True,  help="Cartella immagini originali")
    parser.add_argument("--dst",     default="public/deck", help="Cartella di destinazione")
    parser.add_argument("--crop",    type=int, default=42,   help="Pixel da tagliare su ogni lato")
    parser.add_argument("--cropx",   type=int, default=None, help="Pixel sinistra/destra (default=crop)")
    parser.add_argument("--cropy",   type=int, default=None, help="Pixel sopra/sotto (default=crop)")
    parser.add_argument("--preview", action="store_true",    help="Solo anteprima dimensioni")
    parser.add_argument("--ext",     default="jpg",          help="Estensione output (jpg/png/webp)")
    args = parser.parse_args()
    cropx = args.cropx if args.cropx is not None else args.crop
    cropy = args.cropy if args.cropy is not None else args.crop

    src_dir = Path(args.src)
    dst_dir = Path(args.dst)

    if not src_dir.exists():
        print(f"Errore: cartella sorgente non trovata: {src_dir}")
        return

    # Collect and sort numerically by filename stem
    files = sorted([
        f for f in src_dir.iterdir()
        if f.suffix.lower() in SUPPORTED
    ], key=lambda f: int(f.stem) if f.stem.isdigit() else 9999)

    if not files:
        print(f"Nessuna immagine trovata in {src_dir}")
        return

    print(f"\nRitaglio {len(files)} immagini  x={cropx}px  y={cropy}px\n")

    for i, src_file in enumerate(files):
        if i >= len(ORDER):
            print(f"  Saltato (oltre le 22 carte): {src_file.name}")
            continue
        out_name = f"{ORDER[i]}.{args.ext.lstrip('.')}"
        dst_file = dst_dir / out_name
        crop_image(src_file, dst_file, cropx, cropy, args.preview)

    if not args.preview:
        print(f"\nSalvate in {dst_dir}/")


if __name__ == "__main__":
    main()
