import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || "aurum-jwt-secret-muito-seguro-para-desenvolvimento-local";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('🔐 [Auth] Verifying token...');
    console.log('🔐 [Auth] Token length:', token?.length || 0);
    console.log('🔐 [Auth] JWT_SECRET:', JWT_SECRET?.substring(0, 20) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('✅ [Auth] Token valid! User:', decoded.userId, 'Role:', decoded.role);
    return decoded;
  } catch (error: any) {
    console.error('❌ [Auth] Token verification failed:', error.message);
    console.error('❌ [Auth] Error name:', error.name);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

