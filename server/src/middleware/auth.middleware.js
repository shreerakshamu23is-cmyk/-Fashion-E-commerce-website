import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Validates JSON Web Tokens in the Authorization header.
 * Attached to all administrative mutating and private endpoints.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. Archival token missing or malformed.',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'quietbattles_ultra_secure_jwt_secret_key_2026_hiring_assessment';

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Archival authentication session has expired or is invalid.',
    });
  }
}

