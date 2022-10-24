import Database from '../database.js';

import { Hash } from '../shared/util/hash.util.js';

/**
 * A auth service class contain functionality for signup and login.
 */
class authService {
  /** Sign up new user. */
  async signup(res, data) {
    const [emailExistence] = await Database.query('SELECT email from user where email  = ?', [data.email]);

    if (emailExistence.length) {
      return res.json('email exist before');
    }

    /**
     * Hash user's password.
     * Set user object.
     */
    const hashPassword = await Hash.hash(data.password);

    const [insertUser] = await Database.execute('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [
      data.name,
      data.email,
      hashPassword,
    ]);

    const [user] = await Database.query('SELECT * from user where id = ?', [insertUser.insertId]);

    return res.json(user[0]);
  }

  /** Login user method. */
  async login(data) {
    const [users] = await Database.query('SELECT * from user where email = ?', [data.email]);

    const user = users[0];

    if (!user || !(await Hash.compare(data.password, user.password))) {
      res.json('User not found');
      return;
    }
    return user;
  }
}

export default new authService();
