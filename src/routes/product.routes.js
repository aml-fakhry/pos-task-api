import { Router } from 'express';

import { Authenticate } from '../shared/middleware/auth.middleware.js';
import productService from '../database/product.service.js';

/**
 * The product router that holds all module routes.
 */
export const productRouter = Router();

/**
 * Gets all products.
 */
productRouter.get('/products', Authenticate, async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

/** Creates invoice. */
productRouter.post('/create-invoice', Authenticate, async (req, res) => {
  const invoices = await productService.createInvoice(req.body);

  res.json(invoices);
});
