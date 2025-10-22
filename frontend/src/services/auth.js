const Auth = {
  getSession() {
    try {
      const raw = localStorage.getItem('bankingSession');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  getUser() {
    const s = this.getSession();
    return s?.user || null;
  },
  isAuthenticated() {
    const s = this.getSession();
    if (!s) return false;
    // Optionally check expiry
    if (s.expiresAt && new Date(s.expiresAt) < new Date()) return false;
    return true;
  },
  login(sessionData) {
    try {
      localStorage.setItem('bankingSession', JSON.stringify(sessionData));
    } catch {}
  },
  logout() {
    try { localStorage.removeItem('bankingSession'); } catch {}
  }
};

export default Auth;
