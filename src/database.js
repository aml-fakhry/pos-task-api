import mysql from 'mysql2';

/**
 * A Database class that is contain initial connection to database.
 */
class Database {
  query;
  execute;
  /**
   * Initial database connection.
   */
  async initDatabase() {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      waitForConnections: true,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 4,
      queueLimit: 0,
    });

    const promisePool = pool.promise();

    console.log('Database connected successfully😎');

    this.query = promisePool.query.bind(promisePool);

    this.execute = promisePool.execute.bind(promisePool);
  }
}
export default new Database();
