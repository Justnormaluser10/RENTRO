// SHA-256 hash of the MVP admin password
// Plaintext password is NEVER stored in client source code
const EXPECTED_ADMIN_HASH = 'dd743235d398a5717e7e5c0529f4e6ca003acd85cfc09392b976a98cef4f1dac';
const SESSION_KEY = 'rentro_admin_session';

async function sha256(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const adminAuth = {
  /**
   * Verifies the entered password using cryptographic SHA-256 hashing.
   * If VITE_ADMIN_PASSWORD env variable is provided, hashes that instead.
   */
  async verifyPassword(inputPassword: string): Promise<boolean> {
    if (!inputPassword) return false;
    
    // Check if custom admin password env variable is set
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
    const inputHash = await sha256(inputPassword.trim());

    if (envPass) {
      const envHash = await sha256(envPass.trim());
      return inputHash === envHash;
    }

    return inputHash === EXPECTED_ADMIN_HASH;
  },

  /**
   * Checks if a valid, unexpired admin session exists in sessionStorage
   */
  isAdminAuthenticated(): boolean {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (!session) return false;
      const parsed = JSON.parse(session);
      if (!parsed.token || !parsed.expiresAt) return false;
      
      // Check expiry (4-hour session window)
      if (Date.now() > parsed.expiresAt) {
        this.destroySession();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Creates a secure session token
   */
  createSession(): void {
    const sessionData = {
      token: 'admin_tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      role: 'admin',
      city: 'Ahmedabad',
      createdAt: Date.now(),
      expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  /**
   * Destroys current admin session
   */
  destroySession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
