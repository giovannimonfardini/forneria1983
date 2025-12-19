'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gera URL com parâmetros para melhor visualização
  const getPdfUrl = () => {
    // Parâmetros otimizados para visualização rápida
    return `${pdfPath}#view=FitH&toolbar=0`;
  };

  if (!isMounted) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen bg-zinc-950 flex flex-col">
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

      {/* PDF Viewer - usando object tag que é mais compatível */}
      <object
        data={getPdfUrl()}
        type="application/pdf"
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
      >
        {/* Fallback para navegadores que não suportam object */}
        <iframe
          src={getPdfUrl()}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
        />
      </object>
    </div>
  );
}