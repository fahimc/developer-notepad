import { Note, sortByKey } from '../../Note';
import './Sidebar.css';

export default function Sidebar(props: {
  notesList: Note[];
  onChange: (note: Note) => void;
  onRemove: (id: string) => void;
  createNewNote: () => void;
}) {
  const { notesList, onChange, onRemove, createNewNote } = props;
  return (
    <div className="sidebar">
      <div className="header">
        <span className="title">Notes</span>
        <button onClick={() => createNewNote()}>+</button>
      </div>
      <div className="wrapper">
        {sortByKey(notesList || [], 'created').map((note, index) => {
          const noteInstance = note;
          const { id } = note;
          return (
            <div
              key={`note-${index}`}
              className="sidebar-item"
              onClick={() => {
                onChange(noteInstance);
              }}
            >
              <span>{note?.title || ''}</span>{' '}
              <button
                onClick={(event) => {
                  onRemove(id);
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
