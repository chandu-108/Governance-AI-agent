import React from 'react';
import { Search, ChevronDown, Download, LayoutList, AlignLeft } from 'lucide-react';

const AuditToolbar = ({
  search, onSearchChange,
  decisionFilter, onDecisionChange,
  agentFilter, onAgentChange,
  onExport,
  agents,
  viewMode, onViewModeChange,
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
          placeholder="Search actions or reasons..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder-gray-400"
        />
      </div>

      {/* Decision Filter */}
      <div className="relative">
        <select
          value={decisionFilter}
          onChange={(e) => onDecisionChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
        >
          <option value="">All Decisions</option>
          <option value="ALLOW">Allow</option>
          <option value="DENY">Deny</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Agent Filter */}
      <div className="relative">
        <select
          value={agentFilter}
          onChange={(e) => onAgentChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
        >
          <option value="">All Agents</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          <button onClick={() => onViewModeChange('timeline')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <AlignLeft className="h-4 w-4" />
          </button>
          <button onClick={() => onViewModeChange('table')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutList className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  </div>
);

export default AuditToolbar;
