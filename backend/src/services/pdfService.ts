import PDFDocument from 'pdfkit';
import { Invoice, Customer } from '@prisma/client';

export const generateInvoicePdf = (invoice: Invoice, customer: Customer) => {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(20).text('Rechnung', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Rechnung Nr.: ${invoice.number ?? 'Entwurf'}`);
  doc.text(`Kunde: ${customer.name}`);
  doc.text(`Datum: ${invoice.issuedAt ? invoice.issuedAt.toDateString() : 'Entwurf'}`);
  doc.moveDown();
  doc.text(`Gesamt: ${(invoice.totalCents / 100).toFixed(2)} EUR`);
  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};
