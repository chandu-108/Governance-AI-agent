import React from 'react';
import { motion } from 'framer-motion';
import { Power, PowerOff } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const EmergencyToggle = ({ isEmergency, onToggle }) => {
  return (
    <Card className="border-gray-200 shadow-sm relative overflow-hidden bg-gray-900 text-white border-none h-full">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-900 to-black pointer-events-none" />
      <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center relative z-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">Global Kill Switch</h2>
        <p className="text-sm text-gray-400 mb-8 max-w-sm">
          {isEmergency 
            ? "Platform is currently in EMERGENCY MODE. All AI agents are suspended. Toggle to restore normal operations."
            : "Use this switch to immediately suspend all AI agent operations across the entire platform in case of emergency."}
        </p>

        <button
          onClick={onToggle}
          className={`relative group flex items-center justify-center w-48 h-48 rounded-full border-8 transition-all duration-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-gray-900 ${
            isEmergency 
              ? 'bg-red-600 border-red-700/50 focus:ring-red-500 shadow-red-900/50 hover:bg-red-500 hover:scale-105' 
              : 'bg-gray-800 border-gray-700 focus:ring-emerald-500 hover:bg-emerald-600 hover:border-emerald-700 hover:scale-105 shadow-black/50'
          }`}
        >
          {isEmergency ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <PowerOff className="h-16 w-16 text-white mb-2" />
              <span className="text-lg font-bold tracking-widest uppercase">Restore</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <Power className="h-16 w-16 text-white/50 group-hover:text-white mb-2 transition-colors duration-300" />
              <span className="text-lg font-bold tracking-widest uppercase text-white/70 group-hover:text-white transition-colors duration-300">Stop All</span>
            </motion.div>
          )}

          {/* Pulse rings when active */}
          {isEmergency && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full border-2 border-red-500 opacity-10 animate-ping" style={{ animationDelay: '300ms' }}></div>
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
};

export default EmergencyToggle;
