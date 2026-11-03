import type { ReactNode } from "react";

function renderBody(body: string): ReactNode[] {
  const lines = body.split("\n").map(line => line.trim()).filter(Boolean);
  const parts: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) parts.push(<p key={`p-${parts.length}`}>{paragraph.join(" ")}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) parts.push(<ul key={`ul-${parts.length}`}>{list.map((line, itemIndex) => <li key={itemIndex}>{line}</li>)}</ul>);
    list = [];
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return parts;
}

export default function MaterialContent({ content }: { content: string }) {
  const normalized = content.replace(/\r\n?/g, "\n").trim();
  const sections = normalized.split(/(?=^##\s+)/m).map(section => section.trim()).filter(Boolean);

  return <div className="material-content">{sections.map((section, index) => {
    const headingEnd = section.indexOf("\n");
    const heading = section.startsWith("## ") ? (headingEnd === -1 ? section.slice(3) : section.slice(3, headingEnd).trim()) : "";
    const body = heading ? (headingEnd === -1 ? "" : section.slice(headingEnd + 1)) : section;
    return <section className="material-section" key={index}>
      {heading && <h3>{heading}</h3>}
      <div className="material-section-body">{renderBody(body)}</div>
    </section>;
  })}</div>;
}
