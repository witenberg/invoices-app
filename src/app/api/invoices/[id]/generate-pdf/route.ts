import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import pool from '@/lib/db';
import { InvoiceToPDF } from '@/types/invoice';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const query = `
    SELECT 
      i.invoiceid,
      i.date,
      i.currency,
      i.products,
      u.username,
      c.name AS client_name
    FROM public.invoices i
    JOIN public.users u ON i.userid = u.userid
    JOIN public.clients c ON i.clientid = c.clientid
    WHERE i.invoiceid = $1
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    const invoice: InvoiceToPDF = result.rows[0];
    const { invoiceid, date, currency, products, username, client_name } = invoice;

    const total = products
      .reduce((sum, product) => {
        const price = parseFloat(product.amount) || 0;
        const quantity = product.quantity || 1;
        return sum + price * quantity;
      }, 0)
      .toFixed(2);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFont('times', 'normal');

    doc.setFontSize(20);
    doc.text(username, 20, 20);

    doc.setFontSize(10);
    doc.text('INVOICE TO', 20, 40);
    doc.setFontSize(12);
    doc.text(client_name, 20, 45);

    doc.setFontSize(10);
    doc.text('DATE', 150, 20);
    doc.setFontSize(12);
    doc.text(formattedDate, 150, 25);
    doc.setFontSize(10);
    // doc.text(`ID ${invoiceid}`, 150, 30);

    doc.setFontSize(12);
    doc.text('DESCRIPTION', 20, 60);
    doc.text(`AMOUNT (${currency})`, 150, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 62, 190, 62);

    let yPosition = 70;
    products.forEach((product) => {
      doc.setFontSize(10);
      doc.text(product.name, 20, yPosition);
      doc.text(`${product.quantity} x ${parseFloat(product.amount).toFixed(2)}`, 80, yPosition, { align: 'center' });
      doc.text(`${(parseFloat(product.amount) * product.quantity).toFixed(2)}`, 150, yPosition);
      yPosition += 10;
    });

    doc.line(20, yPosition, 190, yPosition);
    doc.setFontSize(12);
    doc.text('TOTAL', 20, yPosition + 5);
    doc.text(total, 150, yPosition + 5);

    doc.setFontSize(12);
    doc.text(`AMOUNT DUE`, 20, yPosition + 15);
    doc.setFontSize(16);
    doc.text(`${currency} ${total}`, 150, yPosition + 15);

    doc.setFontSize(8);
    doc.text('Powered by Invoices App', 105, 270, { align: 'center' });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${username}-invoice-${invoiceid}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}