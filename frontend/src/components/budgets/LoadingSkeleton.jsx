import React from 'react';

const BudgetCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="w-16 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-100 rounded w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const BudgetListSkeleton = () => (
  <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-gray-100">
    <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="w-32 h-3 rounded bg-gray-200 hidden lg:block" />
    <div className="w-16 h-5 rounded-full bg-gray-200" />
  </div>
);

const LoadingSkeleton = ({ count = 6, viewMode = 'grid' }) =>
  viewMode === 'grid' ? (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => <BudgetCardSkeleton key={i} />)}
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {Array(count).fill(0).map((_, i) => <BudgetListSkeleton key={i} />)}
    </div>
  );

export default LoadingSkeleton;
