import PDFViewer from '@/components/PDFViewer';

export const metadata = {
  title: 'Pizza Menu | Forneria 1983',
  description: 'Check out our complete artisan pizza menu.',
};

export default function PizzasInglesPage() {
  return (
    <PDFViewer
      pdfPath="/pdfs/pizzas-ingles.pdf"
      title="Pizza Menu (English)"
      downloadName="pizza-menu-forneria1983.pdf"
    />
  );
}
