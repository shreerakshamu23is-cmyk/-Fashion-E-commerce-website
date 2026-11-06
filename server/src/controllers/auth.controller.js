import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model.js';

/**
 * Admin Authentication Controller
 */

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Query admin by email via AdminModel
    const admin = await AdminModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Verify hashed password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'quietbattles_ultra_secure_jwt_secret_key_2026_hiring_assessment';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'atelier_admin',
      },
      secret,
      { expiresIn }
    );

    return res.json({
      message: 'Authentication successful.',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

export async function getProfile(req, res) {
  return res.json({
    admin: req.admin,
  });
}
