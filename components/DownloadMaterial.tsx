"use client";

type DownloadMaterialProps = {
  title: string;
  description: string;
  objectives: string[];
  content: string;
  label: string;
  objectivesLabel: string;
  materialLabel: string;
};

export default function DownloadMaterial({ title, description, objectives, content, label, objectivesLabel, materialLabel }: DownloadMaterialProps) {
  const download = () => {
    const markdown = [
      `# ${title}`,
      description,
      "",
      `## ${objectivesLabel}`,
      ...objectives.map(objective => `- ${objective}`),
      "",
      `## ${materialLabel}`,
      content.trim(),
      "",
    ].join("\n");
    const blob = new Blob(["\uFEFF", markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const filename = title.normalize("NFKD").replace(/[\\/:*?\"<>|\u0000-\u001f]/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "materi";
    anchor.href = url;
    anchor.download = `${filename}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="material-download-row"><button className="material-download-button" type="button" onClick={download}><span aria-hidden="true">↓</span>{label}</button></div>;
}
