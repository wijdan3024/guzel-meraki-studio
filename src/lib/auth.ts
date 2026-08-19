import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

// ---- Password hashing ----

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ---- JWT tokens ----
// The token is stored in an httpOnly cookie (set by the login/register
// routes) rather than kept in server memory — this is what makes auth
// "stateless": any serverless function instance can verify the token
// without needing to remember anything about a previous request.

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// ---- Convenience: read the logged-in user straight from a request ----
// Import type only where needed to avoid a hard dependency here.
export function getAuthUser(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
}): TokenPayload | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}