import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import UserSettings from '../../services/userSettings';
import Button from '../../components/ui/Button';

const Settings = () => {
  const [settings, setSettings] = useState(UserSettings.get());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // apply theme on mount
    UserSettings.applyTheme(settings.theme);
  }, []);

  const update = (key, val) => setSettings((s) => ({ ...s, [key]: val }));

  const save = () => {
    UserSettings.set(settings);
    UserSettings.applyTheme(settings.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h1 className="text-xl font-semibold text-foreground mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground mb-6">Configure preferences, notifications, and security.</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Appearance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm text-muted-foreground">Theme</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  value={settings.theme}
                  onChange={(e) => update('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Notifications</h2>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm text-foreground">Enable notifications</p>
                  <p className="text-xs text-muted-foreground">Receive important account alerts and updates.</p>
                </div>
                <input type="checkbox" checked={settings.notifications} onChange={(e)=>update('notifications', e.target.checked)} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Language</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm text-muted-foreground">Default language</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  value={settings.language}
                  onChange={(e) => update('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="en-ZM">English (Zambia)</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Security</h2>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <input type="checkbox" checked={settings.twoFactor} onChange={(e)=>update('twoFactor', e.target.checked)} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={save}>Save Changes</Button>
            </div>

            {saved && (
              <div className="text-sm text-success bg-success/10 border border-success/20 rounded-lg p-3">
                Settings saved
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
