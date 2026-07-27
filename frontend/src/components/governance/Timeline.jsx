import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Timeline = ({ events = [] }) => {
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6">
      <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-400" />
        Execution Timeline
      </h3>
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-gray-200">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center min-w-[120px] relative"
          >
            {idx < events.length - 1 && (
              <div className="absolute top-4 left-[50%] w-full h-[2px] bg-gray-200 -z-10" />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 bg-white border-2 ${event.status === 'success' ? 'border-emerald-500 text-emerald-500' : event.status === 'error' ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-400'}`}>
              {event.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : event.status === 'error' ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
            <p className="text-xs font-semibold text-gray-900 text-center">{event.label}</p>
            <p className="text-[10px] text-gray-500 mt-1">{event.timestamp ? format(event.timestamp, 'HH:mm:ss.SSS') : '--:--:--'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
