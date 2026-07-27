import React from 'react';

const AgentCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-1 w-full bg-gray-200" />
    <div className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-200" />
        <div className="w-16 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const AgentListSkeleton = () => (
  <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-gray-100">
    <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="w-16 h-5 rounded-full bg-gray-200" />
    <div className="w-20 h-3 rounded bg-gray-200 hidden md:block" />
  </div>
);

const AgentSkeletons = ({ count = 6, viewMode = 'grid' }) => {
  return viewMode === 'grid' ? (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => <AgentCardSkeleton key={i} />)}
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {Array(count).fill(0).map((_, i) => <AgentListSkeleton key={i} />)}
    </div>
  );
};

export default AgentSkeletons;
