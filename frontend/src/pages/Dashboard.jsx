import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboard';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import {
  Users, Bot, Shield, Lock, DollarSign, Activity, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight, Zap, TrendingUp
} from 'lucide-react';

// Premium muted color palette
const COLORS = {
  allow:   '#059669',
  deny:    '#dc2626',
  active:  '#4f46e5',
  inactive:'#9ca3af',
  total:   '#4f46e5',
  warning: '#d97706',
  exceeded:'#dc2626',
};

const ALLOW_DENY_COLORS = ['#059669', '#dc2626'];
const AGENT_STATUS_COLORS = ['#4f46e5', '#e5e7eb'];

// ─── Card wrapper ──────────────────────────────────────────────────
const DCard = ({ children, className = '' }) => (
  <div className={`gl-card overflow-hidden ${className}`}>{children}</div>
);

// ─── Section header ────────────────────────────────────────────────
const SH = ({ title, action, actionTo }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</h2>
    {action && actionTo && (
      <Link to={actionTo} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
        {action} <ArrowRight size={11} />
      </Link>
    )}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────
const KPI = ({ title, value, icon: Icon, iconBg, sub, animate: anim = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: anim * 0.06 }}
    className="stat-card"
  >
    <div className="flex items-start justify-between mb-4">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg ?? 'bg-gray-100'}`}>
        <Icon size={15} className="text-current" strokeWidth={1.8} />
      </div>
    </div>
    <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none tabular-nums mb-1">{value}</div>
    {sub && <p className="text-[12px] text-gray-400 mt-1.5">{sub}</p>}
  </motion.div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-[11px] font-medium px-3 py-2 rounded-lg shadow-xl border border-gray-700">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>{p.name}: <span className="text-white font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

// ─── Decision Badge ───────────────────────────────────────────────
const DecBadge = ({ allow }) => (
  <span className={`badge ${allow ? 'badge-success' : 'badge-danger'}`}>
    {allow ? 'ALLOW' : 'DENY'}
  </span>
);

// ─── Skeleton block ───────────────────────────────────────────────
const Skeleton = ({ h = 'h-6', w = 'w-full', className = '' }) => (
  <div className={`gl-skeleton ${h} ${w} ${className}`} />
);

const Dashboard = () => {
  const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardService.getSummary,
    staleTime: 30_000,
  });

  const { data: auditStats, isLoading: isLoadingAudit, isError: isErrorAudit, refetch: refetchAudit } = useQuery({
    queryKey: ['dashboardAuditStats'],
    queryFn: dashboardService.getAuditStats,
    staleTime: 30_000,
  });

  const isLoading = isLoadingSummary || isLoadingAudit;
  const isError = isErrorSummary || isErrorAudit;

  if (isError) {
    return (
      <div className="gl-empty">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Failed to load dashboard</h2>
        <p className="text-[13px] text-gray-500 mb-5 max-w-xs text-center">Could not reach the analytics server. Check your network connection.</p>
        <button className="btn-secondary" onClick={() => { refetchSummary(); refetchAudit(); }}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="stat-card space-y-3"><Skeleton h="h-4" w="w-24" /><Skeleton h="h-8" w="w-16" /></div>)}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} h="h-48" />)}
        </div>
      </div>
    );
  }

  const govDecisionsData = [
    { name: 'Allow', value: auditStats?.allowed_count || summary?.audit?.allowed || 0 },
    { name: 'Deny',  value: auditStats?.denied_count  || summary?.audit?.denied  || 0 },
  ];
  const agentStatusData = [
    { name: 'Active',   value: summary?.agents?.active   || 0 },
    { name: 'Inactive', value: summary?.agents?.inactive || 0 },
  ];
  const budgetData = [
    { name: 'OK',       value: Math.max(0, (summary?.budgets?.total || 0) - (summary?.budgets?.warning || 0) - (summary?.budgets?.exceeded || 0)) },
    { name: 'Warning',  value: summary?.budgets?.warning  || 0 },
    { name: 'Exceeded', value: summary?.budgets?.exceeded || 0 },
  ];

  const noDecisions = govDecisionsData[0].value === 0 && govDecisionsData[1].value === 0;
  const noAgents    = agentStatusData[0].value  === 0 && agentStatusData[1].value  === 0;
  const noBudgets   = budgetData[0].value === 0 && budgetData[1].value === 0 && budgetData[2].value === 0;

  const isEmergency = summary?.emergency?.global_enabled;

  return (
    <div className="space-y-7 pb-10">

      {/* ── Emergency Banner ──────────────────────────────── */}
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 border border-red-200 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <p className="text-[13px] font-semibold text-red-700 flex-1">
            Global emergency stop is <strong>active</strong>. All agent operations are suspended.
          </p>
          <Link to="/emergency" className="text-[12px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
            Mission Control <ArrowRight size={12} />
          </Link>
        </motion.div>
      )}

      {/* ── KPI Row ───────────────────────────────────────── */}
      <section>
        <SH title="System Overview" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI
            title="Total Users"
            value={summary?.users?.total || 0}
            icon={Users}
            iconBg="bg-indigo-50 text-indigo-600"
            sub={`${summary?.users?.admins || 0} admin${summary?.users?.admins !== 1 ? 's' : ''}`}
            animate={0}
          />
          <KPI
            title="Registered Agents"
            value={summary?.agents?.total || 0}
            icon={Bot}
            iconBg="bg-violet-50 text-violet-600"
            sub={`${summary?.agents?.active || 0} active`}
            animate={1}
          />
          <KPI
            title="Active Policies"
            value={summary?.policies?.active || 0}
            icon={Shield}
            iconBg="bg-emerald-50 text-emerald-600"
            sub={`${summary?.policies?.total || 0} total`}
            animate={2}
          />
          <KPI
            title="Platform Status"
            value={isEmergency ? 'Emergency' : 'Healthy'}
            icon={isEmergency ? AlertTriangle : TrendingUp}
            iconBg={isEmergency ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}
            sub={`${summary?.emergency?.blocked_agents || 0} agents blocked`}
            animate={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <KPI title="Permissions" value={summary?.permissions?.total || 0} icon={Lock}      iconBg="bg-sky-50 text-sky-600"    animate={4} />
          <KPI title="Budget Alerts" value={(summary?.budgets?.exceeded || 0) + (summary?.budgets?.warning || 0)} icon={DollarSign} iconBg="bg-amber-50 text-amber-600" sub={`${summary?.budgets?.exceeded || 0} exceeded`} animate={5} />
          <KPI title="Total Evaluations" value={summary?.audit?.total_requests || 0} icon={Activity} iconBg="bg-purple-50 text-purple-600" animate={6} />
        </div>
      </section>

      {/* ── Analytics ────────────────────────────────────── */}
      <section>
        <SH title="Analytics" actionTo="/audit" action="View audit logs" />
        <div className="grid gap-4 md:grid-cols-3">

          {/* Decisions Donut */}
          <DCard>
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-900">Governance Decisions</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Allow vs. Deny breakdown</p>
            </div>
            <div className="p-4 flex items-center justify-center h-44">
              {noDecisions ? (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <Activity size={18} className="text-gray-400" />
                  </div>
                  <p className="text-[12px] text-gray-400">No evaluations yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={govDecisionsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={58} innerRadius={38} strokeWidth={2} stroke="#fff">
                      {govDecisionsData.map((_, i) => <Cell key={i} fill={ALLOW_DENY_COLORS[i]} />)}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </DCard>

          {/* Agent Status Donut */}
          <DCard>
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-900">Agent Status</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Active vs. inactive agents</p>
            </div>
            <div className="p-4 flex items-center justify-center h-44">
              {noAgents ? (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <Bot size={18} className="text-gray-400" />
                  </div>
                  <p className="text-[12px] text-gray-400">No agents registered</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={agentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={58} innerRadius={38} strokeWidth={2} stroke="#fff">
                      {agentStatusData.map((_, i) => <Cell key={i} fill={AGENT_STATUS_COLORS[i]} />)}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </DCard>

          {/* Budget Bar */}
          <DCard>
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-900">Budget Overview</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Current allocation status</p>
            </div>
            <div className="p-4 flex items-center justify-center h-44">
              {noBudgets ? (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <DollarSign size={18} className="text-gray-400" />
                  </div>
                  <p className="text-[12px] text-gray-400">No budgets defined</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={budgetData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {budgetData.map((entry, i) => (
                        <Cell key={i} fill={[COLORS.active, COLORS.warning, COLORS.deny][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </DCard>
        </div>
      </section>

      {/* ── Bottom: Activity + Quick Actions ─────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Audit Stream */}
        <div className="lg:col-span-2">
          <SH title="Audit Stream" actionTo="/audit" action="View all" />
          <DCard>
            {summary?.audit?.total_requests > 0 ? (
              <div className="divide-y divide-gray-50">
                {[
                  { action: 'read_database', decision: true,  actor: 'Analyst Agent',   note: 'Policy: read-access-policy' },
                  { action: 'write_record',  decision: false, actor: 'Executor Agent',  note: 'Blocked by: data-write-restriction' },
                  { action: 'http_get',      decision: true,  actor: 'Web Agent',        note: 'Budget: within limit' },
                ].map((ev, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${ev.decision ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      {ev.decision
                        ? <CheckCircle2 size={15} className="text-emerald-600" />
                        : <XCircle     size={15} className="text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate mono">{ev.action}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">{ev.actor} · {ev.note}</p>
                    </div>
                    <DecBadge allow={ev.decision} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity size={28} className="text-gray-300 mb-3" />
                <p className="text-[13px] font-medium text-gray-600">No evaluations recorded</p>
                <p className="text-[11px] text-gray-400 mt-1">Submit your first governance evaluation to see activity.</p>
              </div>
            )}
          </DCard>
        </div>

        {/* Quick Actions */}
        <div>
          <SH title="Quick Actions" />
          <div className="space-y-2">
            {[
              { label: 'New Agent',      sub: 'Register an AI agent',     to: '/agents',      dot: 'bg-indigo-500' },
              { label: 'Create Policy',  sub: 'Define governance rules',   to: '/policies',    dot: 'bg-emerald-500' },
              { label: 'Set Permission', sub: 'Assign RBAC access',        to: '/permissions', dot: 'bg-violet-500' },
              { label: 'Set Budget',     sub: 'Configure cost limits',     to: '/budgets',     dot: 'bg-amber-500' },
              { label: 'Run Evaluation', sub: 'Test governance pipeline',  to: '/governance',  dot: 'bg-sky-500' },
            ].map(({ label, sub, to, dot }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                <Link
                  to={to}
                  className="group flex items-center gap-4 px-4 py-3.5 gl-card gl-card-interactive rounded-xl"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900">{label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
