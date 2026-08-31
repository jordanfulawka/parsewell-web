import { useRef, useState } from 'react';

function FileDropUploader({
  fileType,
  onChange,
}: {
  fileType: string;
  onChange: (e: any) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  function handleDrop(e: any) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file.type !== 'application/pdf') return;
    setFile(e.dataTransfer.files[0]);
    onChange(e);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }

  return (
    <div
      id={fileType}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`border border-subtle-border p-3 border-dashed ${isDragging ? 'bg-amber-500' : ''}`}
    >
      <p>Drag and drop file here</p>
      {file?.name}
    </div>
  );
}

export default FileDropUploader;
