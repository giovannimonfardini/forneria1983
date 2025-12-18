'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, Download, ChevronUp, ChevronDown } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title, downloadName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageWidth, setPageWidth] = useState<number>(0);

  // Atualizar largura da página baseado na tela
  useEffect(() => {
    const updateWidth = () => {
      // Usa 100% da largura da tela, com margem mínima
      const width = Math.min(window.innerWidth - 16, 1200);
      setPageWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header Compacto */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="font-medium text-sm">Voltar</span>
            </button>

            {/* Título */}
            <h1 className="text-white font-semibold text-sm truncate max-w-[40%] text-center">
              {title}
            </h1>

            {/* Botão Download */}
            <a
              href={pdfPath}
              download={downloadName || title}
              className="flex items-center justify-center w-10 h-10 bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full active:scale-95 transition-all shadow-lg shadow-amber-500/25"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center overflow-auto py-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-amber-400 font-medium">Carregando cardápio...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-500/10 rounded-full">
                <ChevronLeft className="w-8 h-8 text-red-500 rotate-45" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Não foi possível carregar</h2>
              <p className="text-zinc-400 mb-6">
                O cardápio não pôde ser carregado.
              </p>
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-lg transition-all"
              >
                Abrir em Nova Aba
              </a>
            </div>
          </div>
        )}

        {/* PDF Document */}
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
          className="flex flex-col items-center"
        >
          {/* Renderiza TODAS as páginas em sequência para scroll contínuo */}
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              className="mb-4 shadow-2xl"
              id={`page-${index + 1}`}
            >
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white"
              />
            </div>
          ))}
        </Document>

        {/* Indicador de página flutuante */}
        {!isLoading && !hasError && numPages > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl border border-zinc-700">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-zinc-800 rounded-full transition-all disabled:opacity-30"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <span className="text-amber-400 font-medium text-sm min-w-[60px] text-center">
                {currentPage} / {numPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-zinc-800 rounded-full transition-all disabled:opacity-30"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}