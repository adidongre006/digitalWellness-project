import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id parameters. These follow OWASP's current baseline recommendation
 * for Argon2id (memory-hard, resistant to GPU/ASIC cracking) rather than a
 * library default, which can be considerably weaker. Tune memoryCost down
 * only if the deployment target has a hard per-request memory ceiling, and
 * document why if you do.
 */
const ARGON2_OPTIONS = {
  memoryCost: 19456, // ~19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const;

export async function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, ARGON2_OPTIONS);
}

export async function verifyPassword(plaintext: string, storedHash: string): Promise<boolean> {
  try {
    return await verify(storedHash, plaintext, ARGON2_OPTIONS);
  } catch {
    // A malformed/mismatched hash should fail closed, not throw past the caller.
    return false;
  }
}

/**
 * Minimum password strength enforced at admin-creation and password-change
 * time. This is intentionally simple (length + character variety) rather
 * than a long banned-password-list check, which is out of scope here but
 * worth adding if this becomes a real deployment with many admins.
 */
export function isPasswordStrongEnough(password: string): { ok: boolean; reason?: string } {
  if (password.length < 12) return { ok: false, reason: "Password must be at least 12 characters." };
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[\d\W]/.test(password);
  if (!hasLetter || !hasNumberOrSymbol) {
    return { ok: false, reason: "Password must mix letters with numbers or symbols." };
  }
  return { ok: true };
}
