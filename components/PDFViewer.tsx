'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title, downloadName }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Detecta se é mobile através do user agent e tela
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gera URL absoluta para o PDF
  const getAbsolutePdfUrl = () => {
    if (typeof window === 'undefined') return pdfPath;
    if (pdfPath.startsWith('http')) return pdfPath;
    return `${window.location.origin}${pdfPath}`;
  };

  // Usa Google Docs Viewer para mobile (funciona em todos os navegadores)
  const getGoogleViewerUrl = () => {
    const absoluteUrl = getAbsolutePdfUrl();
    return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
  };

  // Gera URL com parâmetros para desktop
  const getDesktopPdfUrl = () => {
    return `${pdfPath}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
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

      {/* PDF Viewer - Tela Cheia */}
      {isMobile ? (
        // Mobile: usa Google Docs Viewer
        <iframe
          src={getGoogleViewerUrl()}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          allow="fullscreen"
        />
      ) : (
        // Desktop: usa visualizador nativo do navegador
        <iframe
          src={getDesktopPdfUrl()}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          allow="fullscreen"
        />
      )}
    </div>
  );
}