import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, CreditCard, DollarSign, Activity, AlertCircle } from 'lucide-react';

import { budgetsService } from '../services/budgets';
import { agentsService } from '../services/agents';
import { useToast } from '../components/ui/Toast';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetDrawer from '../components/budgets/BudgetDrawer';
import DeleteDialog from '../components/budgets/DeleteDialog';
import BudgetToolbar from '../components/budgets/BudgetToolbar';
import BudgetCharts from '../components/budgets/BudgetCharts';
import EmptyState from '../components/budgets/EmptyState';
import LoadingSkeleton from '../components/budgets/LoadingSkeleton';
import StatCard from '../components/ui/StatCard';
import { getBudgetStatus } from '../components/budgets/StatusBadge';

const PAGE_SIZE = 9;

const formatCurrency = (val, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(val);
};

const sortBudgets = (budgets, sortBy) => {
  const s = [...budgets];
  switch (sortBy) {
    case 'oldest': return s.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'limit_desc': return s.sort((a, b) => Number(b.monthly_limit) - Number(a.monthly_limit));
    case 'limit_asc': return s.sort((a, b) => Number(a.monthly_limit) - Number(b.monthly_limit));
    case 'used_desc': return s.sort((a, b) => Number(b.monthly_used) - Number(a.monthly_used));
    case 'used_asc': return s.sort((a, b) => Number(a.monthly_used) - Number(b.monthly_used));
    case 'newest':
    default:
      return s.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

const Budgets = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const { data: budgets = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['budgets'],
    queryFn: budgetsService.getAll,
    staleTime: 30_000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: budgetsService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); setFormOpen(false); toast({ title: 'Budget configured', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to create budget', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: budgetsService.update,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); setFormOpen(false); setEditingBudget(null); toast({ title: 'Budget updated', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to update budget', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: budgetsService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); setDeletingBudget(null); toast({ title: 'Budget removed', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to remove budget', variant: 'destructive' }),
  });

  // Summary Metrics Computation
  const summaryStats = useMemo(() => {
    let totalLimit = 0;
    let totalUsed = 0;
    let activeCount = 0;
    let exceededCount = 0;

    budgets.forEach((b) => {
      totalLimit += Number(b.monthly_limit);
      totalUsed += Number(b.monthly_used);
      if (b.status === 'ACTIVE') activeCount++;
      if (b.status === 'EXCEEDED' || (Number(b.monthly_limit) > 0 && Number(b.monthly_used) >= Number(b.monthly_limit))) {
        exceededCount++;
      }
    });

    const remaining = Math.max(0, totalLimit - totalUsed);

    return {
      totalLimit,
      totalUsed,
      remaining,
      activeCount,
      exceededCount,
    };
  }, [budgets]);

  // Filtering + Sorting
  const filtered = useMemo(() => {
    let result = budgets;
    if (search) {
      const q = search.toLowerCase();
      const agentMap = {};
      agents.forEach((a) => { agentMap[a.id] = a.name.toLowerCase(); });
      result = result.filter(
        (b) =>
          (agentMap[b.agent_id] && agentMap[b.agent_id].includes(q))
      );
    }
    if (statusFilter) {
      result = result.filter((b) => {
        const computedStatus = getBudgetStatus(b.monthly_used, b.monthly_limit, b.warning_threshold);
        return computedStatus === statusFilter || b.status === statusFilter;
      });
    }
    if (agentFilter) {
      result = result.filter((b) => b.agent_id === Number(agentFilter));
    }
    if (rangeFilter) {
      result = result.filter((b) => {
        const limit = Number(b.monthly_limit);
        if (rangeFilter === 'low') return limit < 100;
        if (rangeFilter === 'mid') return limit >= 100 && limit <= 1000;
        if (rangeFilter === 'high') return limit > 1000;
        return true;
      });
    }
    return sortBudgets(result, sortBy);
  }, [budgets, agents, search, statusFilter, agentFilter, rangeFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleStatus = useCallback((v) => { setStatusFilter(v); setPage(1); }, []);
  const handleAgent = useCallback((v) => { setAgentFilter(v); setPage(1); }, []);
  const handleRange = useCallback((v) => { setRangeFilter(v); setPage(1); }, []);
  const handleSort = useCallback((v) => { setSortBy(v); setPage(1); }, []);

  const openCreate = () => { setEditingBudget(null); setFormOpen(true); };
  const openEdit = (budget) => { setEditingBudget(budget); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingBudget(null); };

  const handleFormSubmit = (data) => {
    if (editingBudget) {
      updateMutation.mutate({ id: editingBudget.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isFiltered = !!(search || statusFilter || agentFilter || rangeFilter);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load budgets</h3>
        <p className="text-sm text-gray-500 mb-5">Could not reach the budgets server. Check your connection.</p>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Budgets</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? 'Loading…' : `${filtered.length} of ${budgets.length} agent budgets`}
        </p>
      </div>

      {/* Top summary cards */}
      {!isLoading && budgets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Allocated" value={formatCurrency(summaryStats.totalLimit)} icon={DollarSign} />
          <StatCard title="Total Spent" value={formatCurrency(summaryStats.totalUsed)} icon={Activity} />
          <StatCard title="Remaining Balance" value={formatCurrency(summaryStats.remaining)} icon={CreditCard} />
          <StatCard
            title="Over Budget"
            value={summaryStats.exceededCount}
            icon={AlertCircle}
            trend={summaryStats.exceededCount > 0 ? 'down' : 'up'}
            description={`${summaryStats.activeCount} active budgets`}
          />
        </div>
      )}

      {/* Charts Section */}
      {!isLoading && budgets.length > 0 && (
        <BudgetCharts budgets={budgets} agents={agents} />
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <BudgetToolbar
          search={search} onSearchChange={handleSearch}
          statusFilter={statusFilter} onStatusChange={handleStatus}
          agentFilter={agentFilter} onAgentChange={handleAgent}
          rangeFilter={rangeFilter} onRangeChange={handleRange}
          sortBy={sortBy} onSortChange={handleSort}
          viewMode={viewMode} onViewModeChange={(m) => { setViewMode(m); setPage(1); }}
          onRefresh={refetch} onCreate={openCreate}
          isRefreshing={isFetching && !isLoading}
          agents={agents}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton count={6} viewMode={viewMode} />
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <EmptyState onCreateClick={openCreate} isFiltered={isFiltered} />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div layout className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} agents={agents} viewMode="grid" onEdit={openEdit} onDelete={setDeletingBudget} onSelect={setSelectedBudget} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 grid grid-cols-[1fr_auto_auto_auto] gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent / Budget</span>
            <span className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilization</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spent</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
          </div>
          <AnimatePresence mode="popLayout">
            {paginated.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} agents={agents} viewMode="list" onEdit={openEdit} onDelete={setDeletingBudget} onSelect={setSelectedBudget} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <BudgetDrawer budget={selectedBudget} agents={agents} onClose={() => setSelectedBudget(null)} onEdit={openEdit} onDelete={setDeletingBudget} />

      {/* Form Dialog */}
      <BudgetForm
        open={formOpen} onClose={closeForm} onSubmit={handleFormSubmit}
        budget={editingBudget}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deletingBudget} onClose={() => setDeletingBudget(null)}
        onConfirm={() => deletingBudget && deleteMutation.mutate(deletingBudget.id)}
        budget={deletingBudget} isLoading={deleteMutation.isPending}
        agents={agents}
      />
    </div>
  );
};

export default Budgets;
