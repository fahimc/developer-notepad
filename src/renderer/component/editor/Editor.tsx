import './Editor.css';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { Note } from '../../Note';
import { useEffect, useState } from 'react';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'neutral',
  themeVariables: {
    primaryColor: '#003f5c',
    primaryTextColor: '#fff',
    primaryBorderColor: '#282b2d',
    lineColor: '#282b2d',
    secondaryColor: '#bc5090',
    tertiaryColor: '#ff6361',
  },
});
const markdownRenderer = new MarkdownIt({
  html: true,
});
export default function Editor(props: {
  currentNote: Note | undefined;
  onChange: (value: string, raw: string) => void;
}) {
  const { onChange, currentNote } = props;
  const [value, setValue] = useState(currentNote?.raw || '');
  useEffect(() => {
    if (currentNote?.raw !== value) {
      setValue(currentNote?.raw || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return (
    <div className="editor">
      <textarea
        className="editor-textarea"
        value={value}
        onChange={async (event) => {
          const text = event.target.value;
          setValue(event.target.value);
          const matches = text.match(/```mermaid[\S\s]*?```/gm);
          const allAsyncResults: any = [];
          if (matches) {
            matches.forEach(async (match) => {
              const func = new Promise((resolve) => {
                const cleanMatch = match
                  .replace('```mermaid', '')
                  .replace('```', '');
                try {
                  const type = mermaid.detectType(cleanMatch);
                  mermaid
                    .render(type, cleanMatch)
                    .then((result) => {
                      const { svg } = result;
                      const newText = text.replace(match, svg);
                      resolve(newText);
                      return newText;
                    })
                    .catch(() => {});
                } catch (e) {
                  console.log(e);
                }
              });
              allAsyncResults.push(func);
            });
          }
          await Promise.all(allAsyncResults);
          const result = markdownRenderer.render(text);
          onChange(result, event.target.value);
        }}
      />
    </div>
  );
}
