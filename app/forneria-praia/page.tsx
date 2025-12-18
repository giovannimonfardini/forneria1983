import PDFViewer from '@/components/PDFViewer';

export const metadata = {
  title: 'Cardápio da Praia | Forneria 1983',
  description: 'Confira o menu especial da nossa unidade na praia.',
};

export default function ForneriaPraiaPage() {
  return (
    <PDFViewer
      pdfPath="/pdfs/forneria-praia.pdf"
      title="Cardápio da Praia"
      downloadName="cardapio-praia-forneria1983.pdf"
    />
  );
}
