import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toolbar from './component/toolbar/Toolbar';
import Sidebar from './component/sidebar/Sidebar';
import Editor from './component/editor/Editor';
import Preview from './component/preview/Preview';
import { Note, sortByKey } from './Note';

let notes: any[] = [];

if (typeof Storage !== 'undefined') {
  // Code for localStorage/sessionStorage.
  if (localStorage.getItem('notes')) {
    notes = JSON.parse(localStorage.getItem('notes') as string);
  }
  sortByKey(notes, 'created');
} else {
  // Sorry! No Web Storage support..
}

function DeveloperEditor() {
  const [notesList, setNotesList] = useState<Note[]>(notes);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(
    notesList[0] || undefined
  );
  // let currentNote: Note | undefined = notesList[0];
  const [markdownText, setMarkdown] = useState<string>(
    currentNote?.content || ''
  );
  function updatePreview(
    text: string | undefined,
    raw: string | undefined,
    title?: string
  ) {
    if (!currentNote) {
      const newNote = {
        created: new Date().getTime(),
        id: uuidv4(),
        title: title !== undefined ? title : 'untitled',
        content: text || '',
        raw: raw || '',
      };
      setCurrentNote(newNote);
      setNotesList([...notesList, newNote]);
      localStorage.setItem('notes', JSON.stringify([...notesList, newNote]));
    } else {
      const newNote = {
        ...currentNote,
        content: text !== undefined ? text : currentNote.content,
        raw: raw !== undefined ? raw : currentNote.raw,
        title: title !== undefined ? title : currentNote.title,
      };
      setCurrentNote(newNote);
      setNotesList([
        ...notesList.filter((item) => item.id !== newNote.id),
        newNote,
      ]);
      localStorage.setItem(
        'notes',
        JSON.stringify([
          ...notesList.filter((item) => item.id !== newNote.id),
          newNote,
        ])
      );
    }

    if (text !== undefined) setMarkdown(text);
  }

  function updateCurrentNote(note: Note) {
    setCurrentNote(note);
    setMarkdown(note.content);
  }

  function removeNote(noteId: string) {
    const newNoteList = notesList.filter((item) => item.id !== noteId);
    setNotesList(newNoteList);
    localStorage.setItem('notes', JSON.stringify(newNoteList));
    if (currentNote?.id === noteId) {
      setCurrentNote(undefined);
      setMarkdown('');
    }
  }

  function createNewNote() {
    const newNote = {
      created: new Date().getTime(),
      id: uuidv4(),
      title: 'untitled',
      content: '',
      raw: '',
    };
    setCurrentNote(newNote);
    setNotesList([...notesList, newNote]);
    localStorage.setItem('notes', JSON.stringify([...notesList, newNote]));
    setMarkdown('');
  }

  return (
    <div className="main-container">
      <Toolbar currentNote={currentNote} onChange={updatePreview} />
      <div className="container">
        <Sidebar
          notesList={notesList}
          onChange={updateCurrentNote}
          onRemove={removeNote}
          createNewNote={createNewNote}
        />
        <Editor currentNote={currentNote} onChange={updatePreview} />
        <Preview content={markdownText} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeveloperEditor />} />
      </Routes>
    </Router>
  );
}
