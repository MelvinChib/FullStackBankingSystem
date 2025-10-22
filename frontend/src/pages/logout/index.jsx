import React, { useEffect } from 'react';
import Auth from '../../services/auth';
import api from '../../services/api';

const Logout = () => {
  useEffect(() => {
    try { api.logout?.(); } catch {}
    try { Auth.logout(); } catch {}
    // Small delay to ensure storage clears before redirect
    const t = setTimeout(() => {
      window.location.replace('/login');
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">Signing you out…</p>
      </div>
    </div>
  );
};

export default Logout;
