import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';

const EmergencyDialog = ({ open, onClose, onConfirm, isActivating, isLoading }) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setReason('');
      setConfirmed(false);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmed && reason.trim()) {
      onConfirm(reason);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={isLoading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isActivating ? 'bg-white' : 'bg-gray-900 text-white'}`}
          >
            {/* Header banner */}
            <div className={`px-6 py-4 flex items-center gap-3 ${isActivating ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {isActivating ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
              <h2 className="text-lg font-bold tracking-wide uppercase">
                {isActivating ? 'Activate Global Emergency Stop' : 'Restore Global Operations'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div>
                <p className={`text-sm font-medium mb-4 ${isActivating ? 'text-gray-900' : 'text-white'}`}>
                  {isActivating 
                    ? "You are about to suspend ALL AI agents and block all automated requests across the entire platform. This action takes immediate effect."
                    : "You are about to lift the global suspension. All AI agents will immediately resume normal processing."}
                </p>
                
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isActivating ? 'text-gray-700' : 'text-gray-400'}`}>
                  Required Reason for Audit Log
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={isActivating ? "e.g., Critical zero-day vulnerability detected in policy engine..." : "e.g., Vulnerability patched. Systems verified safe..."}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none text-sm ${
                    isActivating 
                      ? 'bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder-gray-400'
                      : 'bg-gray-800 border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 text-white placeholder-gray-500'
                  }`}
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    id="confirm"
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className={`w-4 h-4 rounded focus:ring-2 transition-colors ${
                      isActivating
                        ? 'text-red-600 border-gray-300 focus:ring-red-500'
                        : 'text-emerald-500 border-gray-600 bg-gray-800 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                <label htmlFor="confirm" className={`text-sm select-none ${isActivating ? 'text-gray-700' : 'text-gray-300'}`}>
                  I confirm that I understand the impact of this action and take full responsibility.
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${
                    isActivating
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-300 bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmed || !reason.trim() || isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActivating
                      ? 'text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20'
                      : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isActivating ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                  {isActivating ? 'Execute Stop' : 'Restore Operations'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyDialog;
