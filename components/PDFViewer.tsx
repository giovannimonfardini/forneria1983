'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Download, ExternalLink, X, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  downloadName?: string;
}

export default function PDFViewer({ pdfPath, title, downloadName }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta se é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Detecta fullscreen
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('fullscreenchange', () => {});
    };
  }, []);

  const toggleFullscreen = () => {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Erro ao entrar em fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // Função para abrir PDF externamente
  const openPDFExternal = () => {
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  // Função para gerar URL otimizada para mobile
  const getMobilePDFUrl = (url: string) => {
    // Para Google Drive
    if (url.includes('drive.google.com')) {
      return url.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');
    }

    // Para servidores comuns
    try {
      const urlObj = new URL(url);

      // Parâmetros para visualização mobile otimizada
      urlObj.searchParams.set('embed', 'true');
      urlObj.searchParams.set('navpanes', '0');
      urlObj.searchParams.set('toolbar', '0');
      urlObj.searchParams.set('statusbar', '0');
      urlObj.searchParams.set('scrollbar', '0');
      urlObj.searchParams.set('view', 'FitH');
      urlObj.searchParams.set('zoom', 'page-width');

      return urlObj.toString();
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Header Compacto para Mobile */}
      <header className={`sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 transition-all duration-300 ${
        isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="font-medium text-sm">Voltar</span>
            </button>

            {/* Título */}
            <div className="flex-1 px-3 max-w-[60%]">
              <h1 className="text-white font-semibold text-sm truncate text-center">
                {title}
              </h1>
            </div>

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

      {/* Controles Flutuantes */}
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col gap-2 transition-all duration-300 ${
        isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {/* Controle de Zoom */}
        <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md rounded-full p-2 shadow-2xl">
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-zinc-800 rounded-full transition-all active:scale-95"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <button
            onClick={resetZoom}
            className="px-3 py-1 text-xs font-medium text-amber-400 hover:bg-zinc-800 rounded-full transition-all"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-zinc-800 rounded-full transition-all active:scale-95"
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        {/* Botão Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-14 h-14 flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full shadow-2xl shadow-amber-500/30 active:scale-95 transition-all"
          title="Tela Cheia"
        >
          {isFullscreen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
      </div>

      {/* Conteúdo Principal */}
      <main className="relative">
        {/* Estado de Loading */}
        {isLoading && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-zinc-900">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-amber-400 font-medium">Carregando cardápio...</p>
                <p className="text-zinc-500 text-sm mt-1">Isso pode levar alguns instantes</p>
              </div>
            </div>
          </div>
        )}

        {/* Estado de Erro */}
        {hasError && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-zinc-900 p-4">
            <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-500/10 rounded-full">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Não foi possível carregar</h2>
              <p className="text-zinc-400 mb-6">
                O cardápio não pôde ser carregado. Tente abrir em outra janela.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={openPDFExternal}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-lg transition-all active:scale-95"
                >
                  <ExternalLink className="w-5 h-5" />
                  Abrir em Nova Janela
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="py-3 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Container do PDF com controles de zoom */}
        <div className="w-full overflow-hidden bg-zinc-900">
          <div
            className="overflow-auto"
            style={{
              height: `calc(100vh - ${isMobile ? '68px' : '80px'})`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s ease',
            }}
          >
            {/* Usando iframe com parâmetros otimizados para mobile */}
            <iframe
              src={getMobilePDFUrl(pdfPath)}
              className="w-full min-h-full"
              onLoad={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              title={title}
              allow="fullscreen"
              loading="eager"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              style={{
                pointerEvents: 'auto',
              }}
            />
          </div>
        </div>

        {/* Overlay de ajuda para mobile */}
        {!isLoading && !hasError && isMobile && !isFullscreen && (
          <div className="fixed bottom-20 left-4 right-4 z-30 animate-fade-in">
            <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-4 border border-amber-500/20 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-500/10 rounded-full flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">Dica de uso</p>
                  <p className="text-zinc-400 text-xs">
                    Toque com dois dedos para zoom ou use os botões flutuantes. Para melhor experiência, use o modo tela cheia.
                  </p>
                </div>
                <button
                  onClick={() => {}}
                  className="text-amber-400 hover:text-amber-300 text-xs font-medium"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Fullscreen Controls */}
      {isFullscreen && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleFullscreen}
            className="w-12 h-12 flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full backdrop-blur-md transition-all active:scale-95"
            title="Sair da tela cheia"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}