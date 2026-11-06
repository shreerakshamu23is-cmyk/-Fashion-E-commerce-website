import { query } from '../config/db.js';

/**
 * Admin Model
 * Encapsulates administrative credential lookups.
 */
export const AdminModel = {
  async findByEmail(email) {
    const rows = await query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0] || null;
  },
};

