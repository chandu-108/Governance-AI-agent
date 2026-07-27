import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Lock } from 'lucide-react';

import { permissionsService } from '../services/permissions';
import { agentsService } from '../services/agents';
import PermissionCard from '../components/permissions/PermissionCard';
import PermissionForm from '../components/permissions/PermissionForm';
import PermissionDrawer from '../components/permissions/PermissionDrawer';
import PermissionDeleteDialog from '../components/permissions/PermissionDeleteDialog';
import PermissionToolbar from '../components/permissions/PermissionToolbar';
import PermissionEmptyState from '../components/permissions/PermissionEmptyState';
import PermissionSkeletons from '../components/permissions/PermissionSkeletons';

const PAGE_SIZE = 9;

const sortPerms = (perms, sortBy) => {
  const s = [...perms];
  switch (sortBy) {
    case 'oldest': return s.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'name_asc': return s.sort((a, b) => a.permission.localeCompare(b.permission));
    case 'name_desc': return s.sort((a, b) => b.permission.localeCompare(a.permission));
    default: return s.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

const Permissions = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState(null);
  const [deletingPerm, setDeletingPerm] = useState(null);
  const [selectedPerm, setSelectedPerm] = useState(null);

  const { data: permissions = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsService.getAll,
    staleTime: 30_000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: permissionsService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); setFormOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: permissionsService.update,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); setFormOpen(false); setEditingPerm(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: permissionsService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); setDeletingPerm(null); },
  });

  const filtered = useMemo(() => {
    let result = permissions;
    if (search) {
      const q = search.toLowerCase();
      const agentMap = {};
      agents.forEach((a) => { agentMap[a.id] = a.name.toLowerCase(); });
      result = result.filter(
        (p) =>
          p.permission.toLowerCase().includes(q) ||
          (agentMap[p.agent_id] && agentMap[p.agent_id].includes(q)) ||
          String(p.user_id).includes(q)
      );
    }
    if (typeFilter) result = result.filter((p) => p.permission === typeFilter);
    if (agentFilter) result = result.filter((p) => p.agent_id === Number(agentFilter));
    return sortPerms(result, sortBy);
  }, [permissions, agents, search, typeFilter, agentFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleType = useCallback((v) => { setTypeFilter(v); setPage(1); }, []);
  const handleAgent = useCallback((v) => { setAgentFilter(v); setPage(1); }, []);
  const handleSort = useCallback((v) => { setSortBy(v); setPage(1); }, []);

  const openCreate = () => { setEditingPerm(null); setFormOpen(true); };
  const openEdit = (perm) => { setEditingPerm(perm); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingPerm(null); };

  const handleFormSubmit = (data) => {
    if (editingPerm) {
      updateMutation.mutate({ id: editingPerm.id, data: { permission: data.permission } });
    } else {
      createMutation.mutate(data);
    }
  };

  const isFiltered = !!(search || typeFilter || agentFilter);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load permissions</h3>
        <p className="text-sm text-gray-500 mb-5">Could not reach the permissions service.</p>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Permissions</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? 'Loading…' : `${filtered.length} of ${permissions.length} permissions`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <PermissionToolbar
          search={search} onSearchChange={handleSearch}
          typeFilter={typeFilter} onTypeChange={handleType}
          agentFilter={agentFilter} onAgentChange={handleAgent}
          sortBy={sortBy} onSortChange={handleSort}
          viewMode={viewMode} onViewModeChange={(m) => { setViewMode(m); setPage(1); }}
          onRefresh={refetch} onCreate={openCreate}
          isRefreshing={isFetching && !isLoading}
          agents={agents}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <PermissionSkeletons count={6} viewMode={viewMode} />
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <PermissionEmptyState onCreateClick={openCreate} isFiltered={isFiltered} />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div layout className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((perm) => (
              <PermissionCard key={perm.id} permission={perm} agents={agents} viewMode="grid" onEdit={openEdit} onDelete={setDeletingPerm} onSelect={setSelectedPerm} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 grid grid-cols-[1fr_auto_auto] gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Permission</span>
            <span className="hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Type / Status</span>
            <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</span>
          </div>
          <AnimatePresence mode="popLayout">
            {paginated.map((perm) => (
              <PermissionCard key={perm.id} permission={perm} agents={agents} viewMode="list" onEdit={openEdit} onDelete={setDeletingPerm} onSelect={setSelectedPerm} />
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
      <PermissionDrawer permission={selectedPerm} agents={agents} onClose={() => setSelectedPerm(null)} onEdit={openEdit} onDelete={setDeletingPerm} />

      {/* Form */}
      <PermissionForm
        open={formOpen} onClose={closeForm} onSubmit={handleFormSubmit}
        permission={editingPerm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete */}
      <PermissionDeleteDialog
        open={!!deletingPerm} onClose={() => setDeletingPerm(null)}
        onConfirm={() => deletingPerm && deleteMutation.mutate(deletingPerm.id)}
        permission={deletingPerm} isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Permissions;
