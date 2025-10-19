import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = { id: number; role: string } & Record<string, any>;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization header' });
  const token = auth.replace(/^Bearer\s+/, '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as JwtPayload | undefined;
  if (!user) return res.status(403).json({ error: 'Not authenticated' });
  if (!roles.includes(user.role)) return res.status(403).json({ error: 'Insufficient role' });
  next();
};
