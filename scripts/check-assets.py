"""Reject executable/remote SVG content, animation and dimension mismatches before publishing."""
import json, struct, sys, xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit
ALLOWED_TAGS={'svg','g','path','rect','circle','ellipse','line','polyline','polygon','text','tspan','defs','linearGradient','radialGradient','stop','clipPath','title','desc'}
ALLOWED_ATTRS={'xmlns','width','height','viewBox','x','y','x1','x2','y1','y2','cx','cy','r','rx','ry','d','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','opacity','fill-opacity','stroke-opacity','transform','font-family','font-size','font-weight','letter-spacing','text-anchor','points','id','offset','stop-color','stop-opacity','gradientUnits','gradientTransform','clip-path','preserveAspectRatio'}
def inspect(path):
 data=path.read_bytes(); ext=path.suffix.lower()
 if len(data)>150000: raise ValueError('Asset exceeds 150 KB')
 if ext=='.svg':
  raw=data.decode('utf8')
  if any(x in raw.lower() for x in ['<!doctype','<!entity','<?xml-stylesheet','javascript:','data:','https:','http:'] if x not in ['http:']): raise ValueError('Unsafe SVG declarations or URLs')
  root=ET.fromstring(raw)
  if root.tag!='{http://www.w3.org/2000/svg}svg':raise ValueError('Invalid SVG namespace')
  for el in root.iter():
   if el.tag.split('}')[-1] not in ALLOWED_TAGS:raise ValueError('Unsafe SVG element')
   for name,v in el.attrib.items():
    if name not in ALLOWED_ATTRS or ('url(' in v and not v.startswith('url(#')) or any(x in v.lower() for x in ['javascript:','http:','https:','data:','@import','expression(']):raise ValueError('Unsafe SVG attribute')
  return int(root.attrib['width']),int(root.attrib['height'])
 if ext=='.png':
  if data[:8]!=b'\x89PNG\r\n\x1a\n' or b'acTL' in data:raise ValueError('Not a static PNG')
  return struct.unpack('>II',data[16:24])
 if ext in ('.jpg','.jpeg'):
  if data[:2]!=b'\xff\xd8':raise ValueError('Not a JPEG')
  i=2
  while i<len(data):
   if data[i]!=255:i+=1;continue
   marker=data[i+1];i+=2
   if marker in (0xd8,0xd9):continue
   length=int.from_bytes(data[i:i+2],'big')
   if marker in (0xc0,0xc1,0xc2):return int.from_bytes(data[i+5:i+7],'big'),int.from_bytes(data[i+3:i+5],'big')
   i+=length
  raise ValueError('Missing JPEG dimensions')
 if ext=='.webp':
  if data[:4]!=b'RIFF' or data[8:12]!=b'WEBP' or b'ANIM' in data or b'ANMF' in data:raise ValueError('Not a static WebP')
  kind=data[12:16]
  if kind==b'VP8X':
   if data[20]&2:raise ValueError('Animated WebP')
   return 1+int.from_bytes(data[24:27],'little'),1+int.from_bytes(data[27:30],'little')
  if kind==b'VP8 ':return int.from_bytes(data[26:28],'little')&0x3fff,int.from_bytes(data[28:30],'little')&0x3fff
  if kind==b'VP8L':
   bits=int.from_bytes(data[21:25],'little');return (bits&0x3fff)+1,((bits>>14)&0x3fff)+1
 raise ValueError('Unsupported image type')
def main():
 c=json.loads(Path('config/config.json').read_text());count=0
 for a in c['campaigns']:
  for v in a['variants']:
   u=urlsplit(v['src'])
   if u.scheme!='https' or not u.path.startswith('/shared-ads/adverts/') or u.netloc!='mightora.github.io':raise ValueError('Artwork must be published from this repository; update this explicit origin check if adopting a custom central domain')
   p=Path('public/adverts')/Path(u.path).name
   if inspect(p)!=(v['width'],v['height']):raise ValueError(f'Dimension mismatch: {p}')
   count+=1
 print(f'Validated {count} static image variants; no executable SVG, remote references or animation')
if __name__=='__main__':
 try:main()
 except Exception as e:print(str(e),file=sys.stderr);sys.exit(1)
