'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Download, Maximize2, ExternalLink } from 'lucide-react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title, downloadName }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openInNewTab = () => {
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  // Gera URL com parâmetros para melhor visualização
  const getPdfUrl = () => {
    // Adiciona parâmetros para exibir o PDF em modo de visualização
    const baseUrl = pdfPath;
    // Para PDFs locais, adiciona parâmetros de visualização
    if (!baseUrl.includes('?')) {
      return `${baseUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
    }
    return baseUrl;
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="font-medium text-sm hidden sm:inline">Voltar</span>
            </button>

            {/* Título */}
            <h1 className="text-white font-semibold text-sm sm:text-base truncate max-w-[40%] text-center">
              {title}
            </h1>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                title="Tela cheia"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              <button
                onClick={openInNewTab}
                className="flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                title="Abrir em nova aba"
              >
                <ExternalLink className="w-5 h-5" />
              </button>

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
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 relative bg-zinc-900">
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-amber-400 font-medium">Carregando cardápio...</p>
            </div>
          </div>
        )}

        {/* PDF Viewer - iframe simples e confiável */}
        <iframe
          src={getPdfUrl()}
          className="w-full border-0"
          style={{ height: 'calc(100vh - 68px)' }}
          onLoad={() => setIsLoading(false)}
          title={title}
          allow="fullscreen"
        />
      </main>
    </div>
  );
}