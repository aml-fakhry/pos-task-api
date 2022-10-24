import { createPool } from 'mysql';
import util from 'util';

/**
 * A Database class that is contain initial connection to database.
 */
class Database {
  query;
  getConnection;

  /**
   * Initial database connection.
   */
  async initDatabase() {
    const pool = createPool({
      connectionLimit: 4,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.getConnection = util.promisify(pool.getConnection).bind(pool);

    const connection = await this.getConnection();
    console.log('Database connected successfully😎');
    connection.release();

    this.query = util.promisify(pool.query).bind(pool);
  }
}
export default new Database();
