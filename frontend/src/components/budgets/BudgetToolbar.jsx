import React from 'react';
import { Search, ChevronDown, LayoutGrid, List, RefreshCw, Plus } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'limit_desc', label: 'Highest Budget' },
  { value: 'limit_asc', label: 'Lowest Budget' },
  { value: 'used_desc', label: 'Most Used' },
  { value: 'used_asc', label: 'Least Used' },
];

const RANGE_OPTIONS = [
  { value: '', label: 'Any Limit' },
  { value: 'low', label: '< $100' },
  { value: 'mid', label: '$100 - $1,000' },
  { value: 'high', label: '> $1,000' },
];

const BudgetToolbar = ({
  search, onSearchChange,
  statusFilter, onStatusChange,
  agentFilter, onAgentChange,
  rangeFilter, onRangeChange,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
  onRefresh, onCreate,
  isRefreshing, agents,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search budgets…"
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder-gray-400"
        />
      </div>

      {/* Agent Filter */}
      <div className="relative">
        <select
          value={agentFilter}
          onChange={(e) => onAgentChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all cursor-pointer"
        >
          <option value="">All Agents</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="HEALTHY">Healthy</option>
          <option value="WARNING">Warning</option>
          <option value="CRITICAL">Critical</option>
          <option value="EXCEEDED">Exceeded</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Range Filter */}
      <div className="relative">
        <select
          value={rangeFilter}
          onChange={(e) => onRangeChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all cursor-pointer"
        >
          {RANGE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* View & Refresh */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          <button onClick={() => onViewModeChange('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => onViewModeChange('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>

        <button onClick={onRefresh} disabled={isRefreshing} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Set Budget</span>
        </button>
      </div>
    </div>
  </div>
);

export default BudgetToolbar;
