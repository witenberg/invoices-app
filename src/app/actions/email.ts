import nodemailer from 'nodemailer'
import pool from '@/lib/db';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendInvoiceEmail(invoiceid: string) {

    try {
        const query = `
          SELECT 
            i.invoiceid,
            i.currency,
            i.products,
            COALESCE(
        (SELECT SUM((p->>'amount')::numeric * (p->>'quantity')::numeric) 
         FROM jsonb_array_elements(i.products) AS p), 0
      ) AS total,
            c.email AS client_email,
            u.username AS user_name
          FROM public.invoices i
          JOIN public.clients c ON i.clientid = c.clientid
          JOIN public.users u ON i.userid = u.userid
          WHERE i.invoiceid = $1
        `;
        const result = await pool.query(query, [parseInt(invoiceid)]);

        if (result.rows.length === 0) {
            throw new Error(`Invoice with ID ${invoiceid} not found`);
        }

        const invoice = result.rows[0];
        const { currency, total, client_email, user_name } = invoice;

        const invoiceUrl = `${process.env.BASE_URL}/invoices/${invoiceid}`

        const mailOptions = {
            from: `"Invoices App" <${process.env.EMAIL_USER}>`,
            to: client_email,
            subject: `Invoice #${invoiceid}`,
            html: `
      <h2>Invoice from ${user_name}</h2>
      <p>Hello,</p>
      <p>You have an invoice to pay:</p>
      <ul>
        <li><strong>Invoice Number:</strong> ${invoiceid}</li>
        <li><strong>Amount: </strong>${currency} ${parseFloat(total).toFixed(2)}</li>
      </ul>
      <p>Please click the button below to view your invoice:</p>
      <a href=${invoiceUrl} style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Invoice</a>
      <p>Thank you!</p>
      <p>Invoices App Team</p>
    `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
