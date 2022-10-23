import { createPool } from 'mysql';
import util from 'util';

const pool = createPool({
  connectionLimit: 4,
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8528599',
  password: 'SghmUiTYa4',
  database: 'sql8528599',
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log('Database connected successfully');
  connection.release();
});

const query = util.promisify(pool.query).bind(pool);

export default { query };
