import jsonwebtoken from 'jsonwebtoken';

/**
 * A helper that provides a set of json web token utility methods.
 */
export class JWT {
  /**
   * Generates and returns a signed json web token based on the provided data.
   * @param userId The id of the user that owns the access token.
   */
  static async genToken(userId) {
    const payload = {
      userId,
    };

    return jsonwebtoken.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '10d' });
  }

  /**
   * Verifies then Decodes and returns the given token if it was valid otherwise returns `null`.
   * @param token The json web token to be decoded.
   * @param ignoreExpiration if `true` do not validate the expiration of the token, default to `false` and the expiration will be validated.
   */
  static async verifyAndDecode(token, ignoreExpiration = false) {
    try {
      return jsonwebtoken.verify(token, process.env.JWT_PRIVATE_KEY, { ignoreExpiration });
    } catch (error) {
      return null;
    }
  }
}
