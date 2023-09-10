import './Toolbar.css';
import { useEffect, useState } from 'react';
import logo from '../../../../assets/logo.png';
import { Note } from '../../Note';

export default function Toolbar(props: {
  currentNote: Note | undefined;
  onChange: (
    text: string | undefined,
    raw: string | undefined,
    title?: string
  ) => void;
}) {
  const { currentNote, onChange } = props;
  const [value, setValue] = useState(currentNote?.title || 'untitled');
  useEffect(() => {
    if (currentNote?.title !== value) {
      setValue(currentNote?.title || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className="toolbar">
      <img className="logo" src={logo} alt="" />
      <span className="logo-title">Developer Notepad</span>
      <input
        value={value || ''}
        className="note-title"
        onChange={(event) => {
          setValue((event.target as any).value);
          onChange(undefined, undefined, (event.target as any).value);
        }}
      />
    </div>
  );
}
