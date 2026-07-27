import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Activity, DownloadCloud } from 'lucide-react';

import { auditService } from '../services/audit';
import { agentsService } from '../services/agents';

import AuditToolbar from '../components/audit/AuditToolbar';
import AuditTimeline from '../components/audit/AuditTimeline';
import AuditDrawer from '../components/audit/AuditDrawer';
import AuditEmpty from '../components/audit/AuditEmpty';
import { AuditTimelineSkeleton, AuditTableSkeleton } from '../components/audit/AuditSkeleton';
import StatCard from '../components/ui/StatCard';

const PAGE_SIZE = 15;

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [viewMode, setViewMode] = useState('timeline');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch agents for dropdown and name mapping
  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 60_000,
  });

  // Backend filtering params
  const filterParams = useMemo(() => {
    const p = {};
    if (decisionFilter) p.decision = decisionFilter;
    if (agentFilter) p.agent_id = Number(agentFilter);
    return p;
  }, [decisionFilter, agentFilter]);

  // Fetch audit logs (using filter endpoint if params exist, else getAll)
  const { data: rawLogs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['auditLogs', filterParams],
    queryFn: () => Object.keys(filterParams).length > 0 
      ? auditService.filter(filterParams) 
      : auditService.getAll(),
    staleTime: 10_000,
  });

  // Client-side search (for reason/action flexible search)
  const filteredLogs = useMemo(() => {
    let result = rawLogs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((log) => 
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q))
      );
    }
    // Always sort newest first (though backend might already do it)
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [rawLogs, search]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const paginated = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleDecision = useCallback((v) => { setDecisionFilter(v); setPage(1); }, []);
  const handleAgent = useCallback((v) => { setAgentFilter(v); setPage(1); }, []);
  
  const handleClearFilters = useCallback(() => {
    setSearch('');
    setDecisionFilter('');
    setAgentFilter('');
    setPage(1);
  }, []);

  const handleExport = () => {
    // Placeholder for CSV export
    alert(`Exporting ${filteredLogs.length} audit records to CSV... (Placeholder)`);
  };

  const isFiltered = !!(search || decisionFilter || agentFilter);

  // Stats
  const allowCount = rawLogs.filter(l => l.decision === 'ALLOW').length;
  const denyCount = rawLogs.filter(l => l.decision === 'DENY').length;
  const allowRate = rawLogs.length > 0 ? Math.round((allowCount / rawLogs.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Audit & Activity Center</h1>
        </div>
        <p className="text-sm text-gray-500">
          {isLoading ? 'Loading logs...' : `Showing ${filteredLogs.length} governance evaluation records`}
        </p>
      </div>

      {/* Top summary cards */}
      {!isLoading && rawLogs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Evaluations" value={rawLogs.length} icon={Activity} />
          <StatCard title="Allowed Actions" value={allowCount} icon={ShieldCheck} trend="up" description={`${allowRate}% approval rate`} />
          <StatCard title="Denied Actions" value={denyCount} icon={DownloadCloud} />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <AuditToolbar
          search={search} onSearchChange={handleSearch}
          decisionFilter={decisionFilter} onDecisionChange={handleDecision}
          agentFilter={agentFilter} onAgentChange={handleAgent}
          onExport={handleExport}
          agents={agents}
          viewMode={viewMode} onViewModeChange={(m) => { setViewMode(m); setPage(1); }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === 'timeline' ? <AuditTimelineSkeleton /> : <AuditTableSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-red-600">
          Failed to load audit logs. Check network connection.
        </div>
      ) : paginated.length === 0 ? (
        <AuditEmpty isFiltered={isFiltered} onClear={handleClearFilters} />
      ) : (
        <AuditTimeline 
          logs={paginated} 
          agents={agents} 
          onSelectLog={setSelectedLog} 
          viewMode={viewMode} 
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
              Previous
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Drawer Details */}
      <AuditDrawer
        log={selectedLog}
        agents={agents}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AuditLogs;
