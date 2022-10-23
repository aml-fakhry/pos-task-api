import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Database from './database.js';
import { Hash } from './util/hash.util.js';
import { JWT } from './util/jwt.util.js';

const PORT = 5000;
const app = express();

dotenv.config();

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

app.post('/signup', async (req, res) => {
  const data = req.body;

  const emailExistence = await Database.query(`SELECT email from user where email = '${data.email}';`);

  if (emailExistence.length) {
    res.json('email exist before');
    return;
  }

  /**
   * Hash user's password.
   * Set user object.
   */
  const hashPassword = await Hash.hash(data.password);

  await Database.query(
    `INSERT INTO user (name, email, password) VALUES ('${data.name}','${data.email}','${hashPassword}')`
  );

  const [{ userId }] = await Database.query(`SELECT LAST_INSERT_ID() As userId;`);
  const user = await Database.query(`SELECT * from user where id = ${userId};`);

  res.send(user);
});

app.post('/login', async (req, res) => {
  const data = req.body;

  const [user] = await Database.query(`SELECT * from user where email = '${data.email}';`);

  if (![user].length || !(await Hash.compare(req.body.password, user.password))) {
    res.json('User not found');
    return;
  }

  const jwt = await JWT.genToken(user.id ?? 0);
  const jwtData = await JWT.verifyAndDecode(jwt, true);

  res.send({ data: { user: user, token: jwt } });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
