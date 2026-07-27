import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Bot } from 'lucide-react';

import { agentsService } from '../services/agents';
import { useToast } from '../components/ui/Toast';
import AgentCard from '../components/agents/AgentCard';
import AgentForm from '../components/agents/AgentForm';
import AgentDrawer from '../components/agents/AgentDrawer';
import DeleteDialog from '../components/agents/DeleteDialog';
import SearchToolbar from '../components/agents/SearchToolbar';
import AgentEmptyState from '../components/agents/AgentEmptyState';
import AgentSkeletons from '../components/agents/AgentSkeletons';

const PAGE_SIZE = 9;

const sortAgents = (agents, sortBy) => {
  const sorted = [...agents];
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

const Agents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deletingAgent, setDeletingAgent] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Fetch
  const { data: agents = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 30_000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: agentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setFormOpen(false);
      toast({ title: 'Agent created', description: 'New agent is now active.', variant: 'success' });
    },
    onError: () => toast({ title: 'Failed to create agent', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: agentsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setFormOpen(false);
      setEditingAgent(null);
      toast({ title: 'Agent updated', variant: 'success' });
    },
    onError: () => toast({ title: 'Failed to update agent', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: agentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setDeletingAgent(null);
      toast({ title: 'Agent removed', variant: 'success' });
    },
    onError: () => toast({ title: 'Failed to delete agent', variant: 'destructive' }),
  });

  // Filtered + sorted + paginated
  const filtered = useMemo(() => {
    let result = agents;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }
    return sortAgents(result, sortBy);
  }, [agents, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleStatus = useCallback((v) => { setStatusFilter(v); setPage(1); }, []);
  const handleSort = useCallback((v) => { setSortBy(v); setPage(1); }, []);

  const openCreate = () => { setEditingAgent(null); setFormOpen(true); };
  const openEdit = (agent) => { setEditingAgent(agent); setFormOpen(true); };
  const openDelete = (agent) => setDeletingAgent(agent);
  const closeForm = () => { setFormOpen(false); setEditingAgent(null); };

  const handleFormSubmit = (data) => {
    if (editingAgent) {
      updateMutation.mutate({ id: editingAgent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAgent) deleteMutation.mutate(deletingAgent.id);
  };

  const isFiltered = !!(search || statusFilter);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load agents</h3>
        <p className="text-sm text-gray-500 mb-5">
          Could not connect to the agents service. Please check your connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Agents</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? 'Loading…' : `${filtered.length} of ${agents.length} agents`}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <SearchToolbar
          search={search}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusChange={handleStatus}
          sortBy={sortBy}
          onSortChange={handleSort}
          viewMode={viewMode}
          onViewModeChange={(m) => { setViewMode(m); setPage(1); }}
          onRefresh={refetch}
          onCreate={openCreate}
          isRefreshing={isFetching && !isLoading}
          total={agents.length}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <AgentSkeletons count={6} viewMode={viewMode} />
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <AgentEmptyState onCreateClick={openCreate} isFiltered={isFiltered} />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div
          layout
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {paginated.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                viewMode="grid"
                onEdit={openEdit}
                onDelete={openDelete}
                onSelect={setSelectedAgent}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          {/* List header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
            <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
          </div>
          <AnimatePresence mode="popLayout">
            {paginated.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                viewMode="list"
                onEdit={openEdit}
                onDelete={openDelete}
                onSelect={setSelectedAgent}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{page}</span> of{' '}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Side Drawer */}
      <AgentDrawer
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Create / Edit Dialog */}
      <AgentForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        agent={editingAgent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deletingAgent}
        onClose={() => setDeletingAgent(null)}
        onConfirm={handleDeleteConfirm}
        agent={deletingAgent}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Agents;
