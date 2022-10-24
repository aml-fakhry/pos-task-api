import Database from '../database.js';

/**
 * A product service class contain functionality for get all products and create invoice.
 */
class productService {
  async getAllProducts() {
    return Database.query('SELECT * FROM product;');
  }

  async insertInvoiceInDB(total) {
    await Database.query(`INSERT INTO invoice (total) VALUES (${total});`);

    const [{ invoiceId }] = await Database.query(`SELECT LAST_INSERT_ID() AS invoiceId`);

    return invoiceId;
  }

  async linkInvoiceWithProduct(invoiceId, invoiceProduct) {
    await Database.query(
      `INSERT INTO invoice_product (invoice_id, product_id, total, quantity) VALUES (${invoiceId}, ${invoiceProduct.product.id},${invoiceProduct.total},${invoiceProduct.quantity})`
    );
  }

  async createInvoice(invoiceProducts) {
    let total = 0;
    invoiceProducts.forEach((invoiceProduct) => {
      total += invoiceProduct.total;
    });

    /** Create invoice in db. */
    const invoiceId = await this.insertInvoiceInDB(total);

    /**
     * Loop for insert each product in invoice.
     */
    for (const invoiceProduct of invoiceProducts) {
      await this.linkInvoiceWithProduct(invoiceId, invoiceProduct);
    }
    return invoiceProducts;
  }
}

export default new productService();
