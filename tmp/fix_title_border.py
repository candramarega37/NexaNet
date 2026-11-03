from docx import Document
from docx.oxml.ns import qn
path = r'docs/Manual-Pengguna-NexaNet.docx'
doc = Document(path)
style = doc.styles['Title']
ppr = style._element.pPr
if ppr is not None:
    border = ppr.find(qn('w:pBdr'))
    if border is not None:
        ppr.remove(border)
doc.save(path)
print('Removed built-in Title border')
