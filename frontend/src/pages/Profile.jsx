import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, Clock, Activity, Lock, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3 text-gray-600">
      <div className="p-1.5 rounded-lg bg-gray-100">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900">{value || '—'}</span>
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full" />
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <UserCircle2 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
        </div>
        <p className="text-sm text-gray-500">View and manage your account information.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <Card className="shadow-sm border-gray-200 text-center overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white text-3xl font-black tracking-tight select-none">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">{user.name || 'User'}</h2>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                user.is_admin 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {user.is_admin ? 'Administrator' : 'Standard User'}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" /> Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <MetaRow icon={User} label="Full Name" value={user.name} />
              <MetaRow icon={Mail} label="Email Address" value={user.email} />
              <MetaRow icon={ShieldCheck} label="Role" value={user.is_admin ? 'Administrator' : 'Standard User'} />
              <MetaRow icon={Activity} label="Account Status" value="Active" />
              <MetaRow
                icon={Calendar}
                label="Member Since"
                value={user.created_at ? format(new Date(user.created_at), 'PPP') : 'N/A'}
              />
            </CardContent>
          </Card>

          {/* Read-only note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Profile details are managed by your system administrator. Contact your admin to update your name or email address.
            </p>
          </div>

          {/* Quick Stats */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" /> Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-2xl font-black text-gray-900">
                    {user.is_admin ? 'Full' : 'Read'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Access Level</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-2xl font-black text-gray-900">Active</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Account Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
