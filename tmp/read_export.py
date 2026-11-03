import pdfplumber
p='tmp/manual-render/Manual-Book-NexaNet.pdf'
with pdfplumber.open(p) as pdf:
 for i,x in enumerate(pdf.pages): print(i+1,(x.extract_text() or '')[:450])
