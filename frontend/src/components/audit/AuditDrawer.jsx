import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, FileJson, Clock, User, Fingerprint, Activity, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';

const JsonViewer = ({ data }) => {
  let parsed = data;
  if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
    } catch {
      return <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono text-gray-500 overflow-x-auto">{data}</div>;
    }
  }

  if (!parsed || (typeof parsed === 'object' && Object.keys(parsed).length === 0)) {
    return <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs italic text-gray-400">No data captured</div>;
  }

  return (
    <pre className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-[11px] leading-relaxed font-mono text-gray-300 overflow-x-auto shadow-inner">
      {JSON.stringify(parsed, null, 2)}
    </pre>
  );
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-2 mb-6">
    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-gray-400" /> {title}
    </h3>
    {children}
  </div>
);

const MetaRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const AuditDrawer = ({ log, agents, onClose }) => {
  if (!log) return null;

  const agent = agents?.find(a => a.id === log.agent_id);
  const agentName = agent?.name || `Agent #${log.agent_id}`;
  const isAllow = log.decision === 'ALLOW';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
        exit={{ x: '100%', transition: { duration: 0.2 } }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col"
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${isAllow ? 'from-emerald-400 to-emerald-600' : 'from-red-500 to-rose-600'}`} />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isAllow ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {isAllow ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isAllow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {log.decision}
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{log.action}</span>
              </div>
              <p className="text-sm text-gray-500">{agentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/30">
          <Section title="Result Summary" icon={Info}>
            <div className={`p-4 rounded-xl border ${isAllow ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-red-50/50 border-red-100 text-red-800'}`}>
              <p className="text-sm font-medium">{log.reason || (isAllow ? 'Governance checks passed.' : 'Governance checks failed.')}</p>
            </div>
          </Section>

          <Section title="Evaluation Context" icon={FileJson}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Policy Trace</p>
                <JsonViewer data={log.policy_checked} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Permission Context</p>
                <JsonViewer data={log.permission_checked} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Budget Context</p>
                <JsonViewer data={log.budget_checked} />
              </div>
            </div>
          </Section>

          <Section title="Request Metadata" icon={Tag}>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
              <MetaRow label="Log ID" value={`#${log.id}`} />
              <MetaRow label="Request ID" value={log.request_id || 'N/A'} />
              <MetaRow label="Action Type" value={log.action} />
              <MetaRow label="Timestamp" value={format(new Date(log.created_at), 'PPP pp')} />
            </div>
          </Section>

          <Section title="Client & Identity" icon={Fingerprint}>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
              <MetaRow label="Executing User" value={`User #${log.user_id}`} />
              <MetaRow label="Target Agent" value={agentName} />
              <MetaRow label="IP Address" value={log.ip_address || 'N/A'} />
              <MetaRow label="User Agent" value={<span className="truncate max-w-[200px]" title={log.user_agent}>{log.user_agent || 'N/A'}</span>} />
            </div>
          </Section>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default AuditDrawer;
