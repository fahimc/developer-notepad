import { useEffect, useRef } from 'react';
import './Preview.css';

export default function Preview(props: { content: string }) {
  const contentRef = useRef<any>();
  useEffect(() => {
    const { content } = props;
    if (contentRef.current)
      (contentRef.current as HTMLElement).innerHTML = content;
  });
  return (
    <div className="preview">
      <div ref={contentRef} />
    </div>
  );
}
