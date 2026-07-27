import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldAlert, Key, DollarSign, FileCode2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const ResultRow = ({ label, icon: Icon, status, details }) => {
  const isPass = status === true || status === 'pass';
  const isFail = status === false || status === 'fail';
  const isPending = status === null || status === undefined;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`p-1.5 rounded-lg flex-shrink-0 ${isPass ? 'bg-emerald-50 text-emerald-600' : isFail ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPass ? 'bg-emerald-100 text-emerald-700' : isFail ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
            {isPass ? 'PASS' : isFail ? 'FAIL' : 'PENDING'}
          </span>
        </div>
        {details && <p className="text-xs text-gray-500 mt-1 truncate">{details}</p>}
      </div>
    </div>
  );
};

const DecisionCard = ({ result, isEvaluating }) => {
  if (!result && !isEvaluating) {
    return (
      <Card className="h-full bg-gray-50/50 border-gray-200 border-dashed flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Awaiting Evaluation</h3>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          Submit an evaluation request to see the final decision and governance breakdown.
        </p>
      </Card>
    );
  }

  const allowed = result?.allowed;
  const reason = result?.reason;
  const ctx = result?.context || {};

  // Check specific statuses based on context structure if available
  const permPass = ctx.permission ? true : (allowed === false && reason.includes('permission') ? false : null);
  const budgetPass = ctx.budget ? true : (allowed === false && reason.includes('budget') ? false : null);
  const policyPass = ctx.policies ? true : (allowed === false && reason.includes('policy') ? false : null);

  return (
    <Card className="h-full border-gray-200 shadow-sm relative overflow-hidden bg-white/50 backdrop-blur-sm flex flex-col">
      <AnimatePresence mode="popLayout">
        {isEvaluating ? (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10"
          >
            <div className="w-16 h-16 relative mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 animate-pulse">Running Evaluation Engine...</h3>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          Evaluation Result
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="p-6 text-center border-b border-gray-100">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg ${allowed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'}`}
          >
            {allowed ? <CheckCircle2 className="h-10 w-10 text-white" /> : <XCircle className="h-10 w-10 text-white" />}
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-3xl font-extrabold tracking-tight mb-2 ${allowed ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {allowed ? 'ALLOW' : 'DENY'}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-600 max-w-sm mx-auto font-medium"
          >
            {reason || (allowed ? 'Request passed all governance checks.' : 'Request failed governance checks.')}
          </motion.p>
        </div>

        <div className="p-5 space-y-1">
          <ResultRow
            label="Permission Check"
            icon={Key}
            status={ctx.permission !== undefined ? (ctx.permission !== null) : permPass}
            details={ctx.permission ? `Granted via role matching` : 'Checking RBAC constraints'}
          />
          <ResultRow
            label="Budget Check"
            icon={DollarSign}
            status={ctx.budget !== undefined ? (ctx.budget !== null) : budgetPass}
            details={ctx.budget ? `Within limit constraints` : 'Checking financial thresholds'}
          />
          <ResultRow
            label="Policy Evaluation"
            icon={FileCode2}
            status={ctx.policies !== undefined ? (ctx.policies && ctx.policies.length >= 0) : policyPass}
            details={ctx.policies ? `${ctx.policies.length} policies evaluated in OPA` : 'Running Rego policies'}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionCard;
