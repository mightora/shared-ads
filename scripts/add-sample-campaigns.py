"""Deterministic, local SVG artwork: no external fonts, scripts or images."""
from pathlib import Path
import json
c=json.loads(Path('config/config.json').read_text())
for a in c['campaigns']:
 a['description']='Cookie-free Mightora promotion. Static artwork, direct link, no visitor measurement.'
for id,name,headline,destination,enabled in [
 ('feedback','Help shape the next version','Your feedback shapes what is next.','https://github.com/mightora/shared-ads/issues/new',True),
 ('techtweedie-blog','Read the TechTweedie blog','Practical ideas from TechTweedie.','https://techtweedie.github.io/',False)]:
 if any(a['id']==id for a in c['campaigns']):continue
 a={**c['campaigns'][0],'id':id,'name':name,'description':'A simple Mightora community message. No cookies, profiling or click tracking.','category':'feedback' if id=='feedback' else 'blog','weight':20,'enabled':enabled,'alt':name+' — opens in a new tab','destination':destination,'variants':[]}
 for size in c['global']['allowedSizes']:
  w,h=map(int,size.split('x'));a['variants'].append({'src':f'https://mightora.github.io/shared-ads/adverts/{id}-{size}.svg','width':w,'height':h})
  title=('Share a little feedback.' if id=='feedback' else 'The TechTweedie blog.') if w<=320 else headline
  y=35 if h==50 else int(h*.7)
  text=f'<text x="16" y="{18 if h==50 else int(h*.38)}" font-size="10" letter-spacing="1" fill="#37654d">MIGHTORA COMMUNITY</text><text x="16" y="{y}" font-size="{12 if w<=320 else 18}" fill="#142b24">{title}</text>'
  if h==250:text='<text x="22" y="50" font-size="11" fill="#37654d">MIGHTORA COMMUNITY</text><text x="22" y="110" font-size="18" fill="#142b24">'+title+'</text><text x="22" y="180" font-size="12" fill="#37654d">Feedback, ideas and useful tools.</text>'
  Path(f'public/adverts/{id}-{size}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" rx="8" fill="#e2eedf"/>{text}</svg>')
 c['campaigns'].append(a)
c['global']['categories']=['mightora-tools','feedback','blog']
c['global']['destinationOrigins']=['https://mightora.io','https://roadmaps.mightora.io','https://github.com','https://techtweedie.github.io']
for s in c['sites']:s['categories']=c['global']['categories']
for name,key in [('global','global'),('sites','sites'),('campaigns','campaigns')]:Path('config/'+name+'.json').write_text(json.dumps({'schemaVersion':1,'revision':c['revision'],key:c[key]},indent=2)+'\n')
Path('config/config.json').write_text(json.dumps(c,indent=2)+'\n')
