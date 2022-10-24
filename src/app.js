import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Database from './database.js';
import { userRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

/**
 * Sets the http-request options for an express server.
 * @param app The express application to set its express server's request options.
 */
function setRequestOptions(app) {
  /**
   * Enable CORS to allow any javascript client to consume your server's api.
   */
  app.use(cors());

  /**
   * Allow parse incoming requests as JSON payloads.
   */
  app.use(express.json({ limit: '5mb' }));

  /**
   * Allow parse incoming urlencoded requests bodies.
   */
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
}

function registerRoutes(app) {
  /**
   * The base-route prefix for the api.
   *
   * e.g. `/api/organizations`, `/api/products`.
   */
  const apiBaseRoute = '/api/';

  app.use(apiBaseRoute, userRouter);
  app.use(apiBaseRoute, productRouter);
}

function setupServer(app) {
  /**
   * The order matters.
   * 2. Set request options.
   * 3. Register routes.
   */

  setRequestOptions(app);
  registerRoutes(app);
}

/**
 * Initial database connection.
 * Starts an express server.
 */
async function startServer() {
  await Database.initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer(app);
startServer();
