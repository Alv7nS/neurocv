'use client';

import React from 'react';

interface Props {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({ onFileUpload }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Please upload a valid PDF.');
    }
  };

  return (
    <div className="mb-8">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="block w-full text-sm text-gray-700
          file:mr-4 file:py-3 file:px-6
          file:rounded-2xl file:border-0
          file:text-base file:font-medium
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200"
      />
    </div>
  );
}
