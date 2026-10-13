# Generate responsive WebP variants for every project JPG in public/images.
# <name>.webp (max 1600w) and <name>-800.webp (800w). Tiny placeholders untouched.
from PIL import Image
import glob, os
os.chdir('public/images')
out = []
for f in sorted(glob.glob('*.jpg')):
    if 'tiny' in f or f.startswith('hero-poster'): continue
    base = f[:-4]
    im = Image.open(f).convert('RGB')
    w, h = im.size
    for width, suffix, q in ((1600, '', 74), (800, '-800', 72)):
        if w < width and suffix: 
            continue
        r = min(1, width / w)
        im2 = im.resize((round(w*r), round(h*r)), Image.LANCZOS) if r < 1 else im
        im2.save(f'{base}{suffix}.webp', 'WEBP', quality=q, method=6)
    out.append((base, w, h, os.path.getsize(f), os.path.getsize(base+'.webp')))
for b,w,h,a,c in out: print(f'{b:28s} {w}x{h}  jpg {a//1024:4d}k -> webp {c//1024:4d}k')
