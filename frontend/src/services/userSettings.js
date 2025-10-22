const KEY = 'userSettings';

const UserSettings = {
  get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { theme: 'light', notifications: true, language: 'en', twoFactor: false };
    } catch {
      return { theme: 'light', notifications: true, language: 'en', twoFactor: false };
    }
  },
  set(settings) {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {}
  },
  applyTheme(theme) {
    try {
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      localStorage.setItem('theme', theme);
    } catch {}
  }
};

export default UserSettings;
