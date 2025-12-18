import PDFViewer from '@/components/PDFViewer';

export const metadata = {
  title: 'Cardápio de Pizzas | Forneria 1983',
  description: 'Confira nosso cardápio completo de pizzas artesanais.',
};

export default function PizzasPage() {
  return (
    <PDFViewer
      pdfPath="/pdfs/pizzas.pdf"
      title="Cardápio de Pizzas"
      downloadName="cardapio-pizzas-forneria1983.pdf"
    />
  );
}
