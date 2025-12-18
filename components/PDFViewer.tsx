'use client';

import { useState } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title, downloadName }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-zinc-900/80 border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline font-medium">Voltar</span>
              </a>
            </div>

            <h1 className="text-lg sm:text-xl font-semibold text-white truncate px-4">
              {title}
            </h1>

            <a
              href={pdfPath}
              download={downloadName || title}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
      </header>

      {/* PDF Container - Full Screen */}
      <main className="flex-1 relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-400 animate-pulse">Carregando cardápio...</p>
            </div>
          </div>
        )}

        {/* PDF iframe - Full Screen */}
        <iframe
          src={pdfPath}
          className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]"
          onLoad={() => setIsLoading(false)}
          title={title}
        />
      </main>
    </div>
  );
}
