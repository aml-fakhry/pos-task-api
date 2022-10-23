import express from 'express';
import cors from 'cors';

import Database from './database.js';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '16mb' }));
app.get('/products', async (req, res) => {
  const products = await Database.query('SELECT * FROM product;');
  res.json(products);
});

app.post('/create-product-invoice', async (req, res) => {
  const invoices = req.body;
  let total = 0;

  invoices.forEach((invoice) => {
    total += invoice.total;
  });

  await Database.query(`INSERT INTO invoice (total) VALUES (${total});`);

  const [{ invoiceId }] = await Database.query(`SELECT LAST_INSERT_ID() AS invoiceId`);

  console.log({ invoiceId });

  for (const invoice of invoices) {
    await Database.query(
      `INSERT INTO invoice_product (invoice_id, product_id, total, quantity) VALUES (${invoiceId}, ${invoice.product.id},${invoice.total},${invoice.quantity})`
    );
  }

  console.log({ invoices });
  res.json(invoices);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
