from docx import Document
from docx.oxml.ns import qn
p=r'docs/Manual-Pengguna-NexaNet.docx'
d=Document(p)
print('paragraphs:',len(d.paragraphs),'sections:',len(d.sections),'bytes:',__import__('os').path.getsize(p))
print('title:',next(x.text for x in d.paragraphs if x.style.name=='Title'))
print('heading1:',sum(x.style.name=='Heading 1' for x in d.paragraphs))
print('title_border:',d.styles['Title']._element.pPr.find(qn('w:pBdr')) is not None)
print('last:',d.paragraphs[-1].text)
