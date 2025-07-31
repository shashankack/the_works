import { SignJWT, jwtVerify } from "jose";

function getSecret(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret(secret));
}

export async function verifyJWT<T>(
  token: string,
  secret: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(secret));
    return payload as T;
  } catch {
    return null;
  }
}
