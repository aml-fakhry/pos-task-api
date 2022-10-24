import { JWT } from '../util/jwt.util.js';

/**
 * Authenticates the coming request by validating the jwt against validity and expiration.
 * @param req The express request.
 * @param res The express response.
 * @param next The next function in the pipeline.
 */
export async function Authenticate(req, res, next) {
  try {
    const jwtData = await JWT.verifyAndDecode(req.headers.authorization || '');

    if (jwtData) {
      req.user = {
        userId: jwtData.userId,
      };
      next();
    } else {
      return res.status(401).send('No valid access token provided');
    }
  } catch (error) {
    console.log({ error });
  }
}
