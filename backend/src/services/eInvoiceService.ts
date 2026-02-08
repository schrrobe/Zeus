import { Invoice, Customer } from '@prisma/client';

export const generateEInvoice = (invoice: Invoice, customer: Customer) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <InvoiceNumber>${invoice.number ?? ''}</InvoiceNumber>
  <IssueDate>${invoice.issuedAt ? invoice.issuedAt.toISOString() : ''}</IssueDate>
  <Customer>
    <Name>${customer.name}</Name>
    <Email>${customer.email ?? ''}</Email>
  </Customer>
  <Totals>
    <TotalCents>${invoice.totalCents}</TotalCents>
  </Totals>
</Invoice>`;
  return Buffer.from(xml, 'utf-8');
};
