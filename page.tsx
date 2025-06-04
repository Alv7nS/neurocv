'use client';

import { useState } from 'react';
import FileUploader from '../components/FileUploader';

export default function HomePage() {
  const [originalText, setOriginalText] = useState('');
  const [optimizedText, setOptimizedText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setOriginalText(data.original);
      setOptimizedText(data.improved);
      setSuggestions(data.suggestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10 bg-gradient-to-b from-gray-50 to-white font-sans text-gray-800">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-blue-700">NeuroCV</h1>
      <p className="text-lg text-center mb-10 text-gray-600">Smart AI-powered resume optimizer for modern professionals</p>
      <div className="max-w-xl mx-auto">
        <FileUploader onFileUpload={handleFileUpload} />
      </div>
      {loading && <p className="text-center mt-4 text-blue-500 animate-pulse">Processing your resume...</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Your Uploaded Resume</h2>
          <div className="p-5 border rounded-2xl shadow-lg text-sm whitespace-pre-wrap bg-white min-h-[300px]">
            {originalText || 'No resume uploaded yet.'}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">Optimized Resume + Suggestions</h2>
          <div className="p-5 border rounded-2xl shadow-lg text-sm whitespace-pre-wrap bg-blue-50 mb-4 min-h-[150px]">
            {optimizedText || 'Your improvements will appear here.'}
          </div>
          <div className="p-5 border rounded-2xl shadow-lg text-sm whitespace-pre-wrap bg-green-50 min-h-[150px]">
            {suggestions || 'Suggestions will be shown here.'}
          </div>
        </div>
      </div>
    </main>
  );
}
