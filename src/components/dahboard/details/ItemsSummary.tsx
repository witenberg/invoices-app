import pool from "@/lib/db";

export async function getItems(type: string, id: string) {
  const client = await pool.connect();
  const products = await client.query(
    `SELECT products.productid, products.name as product_name, p.amount, p.quantity
     FROM productson${type} p 
     JOIN products ON products.productid = p.productid 
     WHERE p.${type}id = $1`,
    [id],
  );

  return { products: products.rows };
}

export async function ItemsSummary({ type, id }: { type: string, id: string }) {
  const { products } = await getItems(type, id);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-sm font-semibold text-blue-600 mb-4">ITEMS</h2>
      <div className="space-y-4">
        {products.map((item) => (
          <div key={item.productid} className="flex justify-between items-center">
            <div className="text-gray-900">{item.product_name}</div>
            <div className="flex items-center gap-8">
              <div className="text-gray-600">
                {item.quantity} × {Number(item.amount).toFixed(2)}
              </div>
              <div className="text-gray-900 w-24 text-right">{(item.quantity * Number(item.amount)).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
