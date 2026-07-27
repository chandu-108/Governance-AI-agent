import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

import { policiesService } from '../services/policies';
import { useToast } from '../components/ui/Toast';
import PolicyCard from '../components/policies/PolicyCard';
import PolicyForm from '../components/policies/PolicyForm';
import PolicyDrawer from '../components/policies/PolicyDrawer';
import PolicyDeleteDialog from '../components/policies/PolicyDeleteDialog';
import PolicyToolbar from '../components/policies/PolicyToolbar';
import PolicyEmptyState from '../components/policies/PolicyEmptyState';
import PolicySkeletons from '../components/policies/PolicySkeletons';

const PAGE_SIZE = 9;

const sortPolicies = (policies, sortBy) => {
  const s = [...policies];
  switch (sortBy) {
    case 'oldest': return s.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'priority_desc': return s.sort((a, b) => b.priority - a.priority);
    case 'priority_asc': return s.sort((a, b) => a.priority - b.priority);
    case 'name_asc': return s.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc': return s.sort((a, b) => b.name.localeCompare(a.name));
    default: return s.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

const Policies = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletingPolicy, setDeletingPolicy] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const { data: policies = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['policies'],
    queryFn: policiesService.getAll,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: policiesService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['policies'] }); setFormOpen(false); toast({ title: 'Policy created', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to create policy', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: policiesService.update,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['policies'] }); setFormOpen(false); setEditingPolicy(null); toast({ title: 'Policy updated', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to update policy', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: policiesService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['policies'] }); setDeletingPolicy(null); toast({ title: 'Policy deleted', variant: 'success' }); },
    onError: () => toast({ title: 'Failed to delete policy', variant: 'destructive' }),
  });

  const filtered = useMemo(() => {
    let result = policies;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.target_resource.toLowerCase().includes(q)
      );
    }
    if (typeFilter) result = result.filter((p) => p.policy_type === typeFilter);
    if (statusFilter === 'active') result = result.filter((p) => p.is_active);
    if (statusFilter === 'inactive') result = result.filter((p) => !p.is_active);
    return sortPolicies(result, sortBy);
  }, [policies, search, typeFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleType = useCallback((v) => { setTypeFilter(v); setPage(1); }, []);
  const handleStatus = useCallback((v) => { setStatusFilter(v); setPage(1); }, []);
  const handleSort = useCallback((v) => { setSortBy(v); setPage(1); }, []);

  const openCreate = () => { setEditingPolicy(null); setFormOpen(true); };
  const openEdit = (policy) => { setEditingPolicy(policy); setFormOpen(true); };
  const openDelete = (policy) => setDeletingPolicy(policy);
  const closeForm = () => { setFormOpen(false); setEditingPolicy(null); };

  const handleFormSubmit = (data) => {
    if (editingPolicy) updateMutation.mutate({ id: editingPolicy.id, data });
    else createMutation.mutate(data);
  };

  const isFiltered = !!(search || typeFilter || statusFilter);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load policies</h3>
        <p className="text-sm text-gray-500 mb-5">Could not reach the policies service. Check your connection.</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Policies</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? 'Loading…' : `${filtered.length} of ${policies.length} policies`}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <PolicyToolbar
          search={search} onSearchChange={handleSearch}
          typeFilter={typeFilter} onTypeChange={handleType}
          statusFilter={statusFilter} onStatusChange={handleStatus}
          sortBy={sortBy} onSortChange={handleSort}
          viewMode={viewMode} onViewModeChange={(m) => { setViewMode(m); setPage(1); }}
          onRefresh={refetch} onCreate={openCreate}
          isRefreshing={isFetching && !isLoading}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <PolicySkeletons count={6} viewMode={viewMode} />
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <PolicyEmptyState onCreateClick={openCreate} isFiltered={isFiltered} />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div layout className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} viewMode="grid" onEdit={openEdit} onDelete={openDelete} onSelect={setSelectedPolicy} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 grid grid-cols-[1fr_auto_auto] gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy</span>
            <span className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Status / Priority</span>
            <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</span>
          </div>
          <AnimatePresence mode="popLayout">
            {paginated.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} viewMode="list" onEdit={openEdit} onDelete={openDelete} onSelect={setSelectedPolicy} />
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
      <PolicyDrawer policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} onEdit={openEdit} onDelete={openDelete} />

      {/* Form dialog */}
      <PolicyForm
        open={formOpen} onClose={closeForm} onSubmit={handleFormSubmit}
        policy={editingPolicy}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete dialog */}
      <PolicyDeleteDialog
        open={!!deletingPolicy} onClose={() => setDeletingPolicy(null)}
        onConfirm={() => deletingPolicy && deleteMutation.mutate(deletingPolicy.id)}
        policy={deletingPolicy} isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Policies;
