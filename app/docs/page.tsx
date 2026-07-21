import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export default async function DocsPage() {
  const filePath = path.join(process.cwd(), 'docs/wiki/OPERATING_PROCEDURES.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const processedContent = await remark()
    .use(html)
    .process(fileContent);
  const contentHtml = processedContent.toString();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>
      <header style={{ marginBottom: "48px", borderBottom: "1px solid var(--border-light)", paddingBottom: "24px" }}>
        <div className="label-caps" style={{ color: "var(--blue)", marginBottom: "8px" }}>Documentation · Knowledge Base</div>
        <h1 className="serif" style={{ fontSize: "42px", margin: 0 }}>The Operating Codex</h1>
      </header>
      <div 
        className="prose-custom"
        style={{ 
            fontSize: "16px", 
            lineHeight: 1.7, 
            color: "var(--ink)",
            fontFamily: "var(--font-hanken)"
        }}
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-custom h1, .prose-custom h2, .prose-custom h3 { 
            font-family: var(--font-newsreader); 
            font-weight: 400;
            margin-top: 40px;
            margin-bottom: 16px;
        }
        .prose-custom h2 { font-size: 28px; color: var(--blue); border-bottom: 1px solid #eee; padding-bottom: 8px; }
        .prose-custom ul { padding-left: 20px; margin-bottom: 24px; }
        .prose-custom li { margin-bottom: 12px; }
        .prose-custom strong { color: var(--blue); }
      `}} />
    </div>
  );
}
