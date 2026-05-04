import base64
import hashlib
import os
import re
from pathlib import Path

ROOT = Path(__file__).parent
IMG_DIR = ROOT / "images"
IMG_DIR.mkdir(exist_ok=True)

# Match xlink:href="data:image/<ext>;base64,<data>" or href="..."
PATTERN = re.compile(
    r'(xlink:href|href)="data:image/([a-zA-Z0-9+]+);base64,([^"]+)"'
)

EXT_MAP = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "gif": "gif", "svg+xml": "svg", "webp": "webp"}


def process(svg_name: str, html_name: str, prefix: str):
    svg_path = ROOT / svg_name
    html_path = ROOT / html_name
    text = svg_path.read_text(encoding="utf-8")

    counter = [0]
    seen: dict[str, str] = {}

    def repl(m: re.Match) -> str:
        attr, mime, b64 = m.group(1), m.group(2), m.group(3)
        ext = EXT_MAP.get(mime.lower(), mime.lower())
        data = base64.b64decode(b64)
        digest = hashlib.sha1(data).hexdigest()[:10]
        if digest in seen:
            rel = seen[digest]
        else:
            counter[0] += 1
            fname = f"{prefix}_{counter[0]:02d}_{digest}.{ext}"
            (IMG_DIR / fname).write_bytes(data)
            rel = f"images/{fname}"
            seen[digest] = rel
        return f'{attr}="{rel}"'

    new_svg = PATTERN.sub(repl, text)

    # Strip XML prolog/doctype for clean inline embedding
    new_svg = re.sub(r'<\?xml[^?]*\?>', '', new_svg)
    new_svg = re.sub(r'<!DOCTYPE[^>]*>', '', new_svg).strip()

    html = (
        "<!DOCTYPE html>\n"
        '<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
        f"<title>{html_path.stem}</title>\n"
        "<style>html,body{margin:0;padding:0;background:#fff;}"
        "svg{display:block;width:100vw;height:auto;}</style>\n"
        "</head>\n<body>\n"
        f"{new_svg}\n"
        "</body>\n</html>\n"
    )
    html_path.write_text(html, encoding="utf-8")
    print(f"{svg_name} -> {html_name}: extracted {counter[0]} unique images")


process("index.svg", "index.html", "index")
process("page1.svg", "page1.html", "page1")
