import pool from '@/lib/db';
import { InvoiceToPDF } from '@/types/invoice';
import { notFound } from 'next/navigation';


export default async function InvoicePage({ params }: { params: { id: string } }) {
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
      notFound();
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

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{username}</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">DATE</p>
            <p className="font-semibold">{formattedDate}</p>
            <p className="text-sm text-gray-600 mt-1">ID {invoiceid}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">INVOICE TO</p>
          <p className="font-semibold text-blue-600">{client_name}</p>
        </div>

        <div className="mb-6">
          {/* Nagłówki tabeli */}
          <div className="flex border-b pb-2 mb-2 font-semibold">
            <span className="w-1/3">DESCRIPTION</span>
            <span className="w-1/3 text-center"></span>
            <span className="w-1/3 text-right">AMOUNT ({currency})</span>
          </div>
          {/* Lista produktów */}
          {products.map((product, index) => (
            <div key={index} className="flex py-2">
              <span className="w-1/3">{product.name}</span>
              <span className="w-1/3 text-center">
                {product.quantity} x {parseFloat(product.amount).toFixed(2)}
              </span>
              <span className="w-1/3 text-right">
                {(parseFloat(product.amount) * product.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          {/* Total */}
          <div className="flex border-t pt-2 mt-2 font-semibold">
            <span className="w-2/3 text-left">TOTAL</span>
            <span className="w-1/3 text-right">{total}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">AMOUNT DUE</span>
          <span className="text-2xl font-bold">{currency} {total}</span>
        </div>

        <div className="mb-6">
          <a
            href={`/api/invoices/${id}/generate-pdf`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF Invoice
          </a>
        </div>

        <div className="text-center text-sm text-gray-500">
          Powered by Invoices App
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return <div className="text-center text-red-600">Error loading invoice</div>;
  }
}