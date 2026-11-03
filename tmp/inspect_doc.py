from docx import Document
from docx.oxml.ns import qn
p=r'docs/Manual-Pengguna-NexaNet.docx'
d=Document(p)
for name in ['Title']:
 s=d.styles[name]
 print(name, s._element.xml)
for i,p in enumerate(d.paragraphs[:8]):
 print(i, p.style.name, p.text[:80], p._p.xml if p.style.name=='Title' else '')
