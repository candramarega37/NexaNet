import pdfplumber
path=r'C:\Users\Windows 11\Downloads\Manual Book NETLAB.docx - Google Dokumen.pdf'
with pdfplumber.open(path) as pdf:
 print('pages', len(pdf.pages))
 for i,p in enumerate(pdf.pages):
  text=p.extract_text() or ''
  print(f'--- PAGE {i+1} ---\n{text[:3500]}')
