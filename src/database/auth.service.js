import Database from '../database.js';

import { Hash } from '../shared/util/hash.util.js';

/**
 * A auth service class contain functionality for signup and login.
 */
class authService {
  /** Sign up new user. */
  async signup(data) {
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

    return user;
  }

  /** Login user method. */
  async login(data) {
    const [user] = await Database.query(`SELECT * from user where email = '${data.email}';`);

    if (![user].length || !(await Hash.compare(data.password, user.password))) {
      res.json('User not found');
      return;
    }
    return user;
  }
}

export default new authService();
