import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Key, DollarSign, Shield, AlertTriangle, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 1, key: 'agent', label: 'Agent Selected', icon: Bot, description: 'Verify agent identity and status' },
  { id: 2, key: 'permission', label: 'Permission Check', icon: Key, description: 'Validate RBAC and scopes' },
  { id: 3, key: 'budget', label: 'Budget Validation', icon: DollarSign, description: 'Check financial utilization limits' },
  { id: 4, key: 'policy', label: 'Policy Evaluation', icon: Shield, description: 'OPA engine context evaluation' },
  { id: 5, key: 'risk', label: 'Risk Assessment', icon: AlertTriangle, description: 'Compute operational risk score' },
  { id: 6, key: 'audit', label: 'Audit Logging', icon: FileText, description: 'Record immutable decision hash' },
  { id: 7, key: 'decision', label: 'Final Decision', icon: CheckCircle2, description: 'Return terminal ALLOW/DENY' }
];

const PipelineStage = ({ stage, currentStage, status, isEvaluating }) => {
  const isPast = currentStage > stage.id;
  const isCurrent = currentStage === stage.id;
  const isPending = currentStage < stage.id;
  
  // Determine if this specific stage failed
  // For simplicity, if we are not evaluating and the final status is false, the stage where it stopped is failed.
  // Actually, we pass a `failedAt` stage ID if there was a failure.
  
  let stateClass = 'bg-gray-50 border-gray-200 text-gray-400';
  let iconClass = 'text-gray-400';
  let lineClass = 'bg-gray-200';
  
  if (isPast || (isCurrent && !isEvaluating && status === 'success')) {
    stateClass = 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-500/10';
    iconClass = 'text-emerald-500';
    lineClass = 'bg-emerald-400';
  } else if (isCurrent && isEvaluating) {
    stateClass = 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500/20';
    iconClass = 'text-blue-500';
    lineClass = 'bg-gradient-to-b from-blue-400 to-gray-200';
  } else if (isCurrent && !isEvaluating && status === 'error') {
    stateClass = 'bg-red-50 border-red-200 text-red-700 shadow-sm shadow-red-500/10 ring-2 ring-red-500/20';
    iconClass = 'text-red-500';
    lineClass = 'bg-gray-200';
  }

  const Icon = stage.icon;

  return (
    <div className="relative flex items-start gap-4">
      {/* Connecting Line */}
      {stage.id < PIPELINE_STAGES.length && (
        <div className="absolute left-[19px] top-10 bottom-[-16px] w-[2px]">
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: isPast ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
            className={`w-full h-full ${lineClass} origin-top`}
          />
          <div className="absolute inset-0 w-full h-full bg-gray-100 -z-10" />
        </div>
      )}

      {/* Circle Icon */}
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: stage.id * 0.05 }}
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white transition-colors duration-300 ${stateClass}`}
      >
        {isCurrent && isEvaluating ? (
          <Loader2 className={`h-4 w-4 animate-spin ${iconClass}`} />
        ) : isCurrent && !isEvaluating && status === 'error' ? (
          <XCircle className={`h-5 w-5 ${iconClass}`} />
        ) : (
          <Icon className={`h-4 w-4 ${iconClass}`} />
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        layout
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: stage.id * 0.05 + 0.1 }}
        className={`flex-1 pb-6 ${isPending ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
      >
        <h3 className={`text-sm font-semibold ${isCurrent && !isEvaluating && status === 'error' ? 'text-red-700' : isPast ? 'text-gray-900' : isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>
          {stage.label}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
      </motion.div>
    </div>
  );
};

const GovernancePipeline = ({ currentStage, status, isEvaluating }) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        Evaluation Pipeline
      </h2>
      <div className="pl-2">
        {PIPELINE_STAGES.map((stage) => (
          <PipelineStage
            key={stage.id}
            stage={stage}
            currentStage={currentStage}
            status={status}
            isEvaluating={isEvaluating}
          />
        ))}
      </div>
    </div>
  );
};

export default GovernancePipeline;
