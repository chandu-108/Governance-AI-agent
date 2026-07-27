import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Code2,
  User,
  AlertTriangle,
  Monitor,
  Sun,
  Moon,
  Check,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SectionLabel = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="p-2 rounded-xl bg-gray-100 mt-0.5 flex-shrink-0">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <div>
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`}
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  </div>
);

const ThemeOption = ({ value, label, icon: Icon, selected, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
      selected
        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-xs font-semibold">{label}</span>
    {selected && <Check className="h-3.5 w-3.5 text-indigo-600" />}
  </button>
);

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    evaluations: true,
    emergencies: true,
    budget: false,
    policy: true,
  });
  const [security, setSecurity] = useState({
    sessionTimeout: true,
    twoFactor: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-sm">
            <SettingsIcon className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
        </div>
        <p className="text-sm text-gray-500">Manage your application preferences and account settings.</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <SectionLabel
              icon={Palette}
              title="Appearance"
              description="Customize how the interface looks on your device."
            />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Color Theme</p>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption value="light" label="Light" icon={Sun} selected={theme === 'light'} onClick={setTheme} />
              <ThemeOption value="dark" label="Dark" icon={Moon} selected={theme === 'dark'} onClick={setTheme} />
              <ThemeOption value="system" label="System" icon={Monitor} selected={theme === 'system'} onClick={setTheme} />
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Note: Dark mode is a UI preference — actual theme switching is a future enhancement.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <SectionLabel
              icon={Bell}
              title="Notifications"
              description="Control which in-app notification alerts you receive."
            />
          </CardHeader>
          <CardContent className="px-6 py-2">
            <Toggle
              checked={notifications.evaluations}
              onChange={(v) => setNotifications((p) => ({ ...p, evaluations: v }))}
              label="Governance Evaluations"
              description="Show notifications when an evaluation completes"
            />
            <Toggle
              checked={notifications.emergencies}
              onChange={(v) => setNotifications((p) => ({ ...p, emergencies: v }))}
              label="Emergency Events"
              description="Alert when emergency kill switch is activated"
            />
            <Toggle
              checked={notifications.budget}
              onChange={(v) => setNotifications((p) => ({ ...p, budget: v }))}
              label="Budget Alerts"
              description="Notify when agents approach budget thresholds"
            />
            <Toggle
              checked={notifications.policy}
              onChange={(v) => setNotifications((p) => ({ ...p, policy: v }))}
              label="Policy Changes"
              description="Notify on policy create/update/delete events"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <SectionLabel
              icon={Shield}
              title="Security"
              description="Manage session and authentication preferences."
            />
          </CardHeader>
          <CardContent className="px-6 py-2">
            <Toggle
              checked={security.sessionTimeout}
              onChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))}
              label="Auto Session Timeout"
              description="Automatically log out after 30 minutes of inactivity"
            />
            <Toggle
              checked={security.twoFactor}
              onChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
              label="Two-Factor Authentication"
              description="Require 2FA on every login (placeholder — requires backend support)"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* API Settings */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <SectionLabel
              icon={Code2}
              title="API Settings"
              description="Integration and API key management."
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">API Key Management</p>
                <p className="text-xs text-gray-500 mt-1">
                  Generate and manage API keys for direct backend access.
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex-shrink-0">
                Coming Soon
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="shadow-sm border-red-200 bg-red-50/30">
          <CardHeader className="border-b border-red-100 pb-4">
            <SectionLabel
              icon={AlertTriangle}
              title="Danger Zone"
              description="These actions are permanent or have significant impact."
            />
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-red-200">
              <div>
                <p className="text-sm font-semibold text-gray-900">Sign Out</p>
                <p className="text-xs text-gray-500 mt-0.5">End your current session and return to login.</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
