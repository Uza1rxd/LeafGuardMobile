import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generate a JWT token for a user
 * @param id User ID to include in the token
 * @param expiresIn Token expiration time (default: '30d')
 * @returns JWT token string
 */
const generateToken = (id: string, expiresIn = '30d'): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn']
  });
};

export default generateToken; 