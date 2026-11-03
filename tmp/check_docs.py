from docx import Document
for p in [r'docs/Manual-Book-NexaNet.docx',r'docs/Manual-Pengguna-NexaNet.docx']:
 d=Document(p);print(p, d.core_properties.title, d.core_properties.subject,d.core_properties.author,len(d.paragraphs),len(d._element.body.xml))
 print('first',d.paragraphs[0].text,'last',d.paragraphs[-1].text)
