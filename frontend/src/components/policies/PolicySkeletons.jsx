import React from 'react';

const PolicyCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-1 w-full bg-gray-200" />
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="w-16 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="h-4 bg-gray-200 rounded-md w-16" />
        <div className="h-4 bg-gray-200 rounded w-10" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded-full w-16" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </div>
);

const PolicyListSkeleton = () => (
  <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-gray-100">
    <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex gap-2 mb-1.5">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded-md w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="hidden lg:flex gap-2">
      <div className="w-14 h-5 rounded-full bg-gray-200" />
      <div className="w-14 h-5 rounded-full bg-gray-200" />
    </div>
    <div className="w-20 h-3 rounded bg-gray-200 hidden md:block" />
  </div>
);

const PolicySkeletons = ({ count = 6, viewMode = 'grid' }) =>
  viewMode === 'grid' ? (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => <PolicyCardSkeleton key={i} />)}
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {Array(count).fill(0).map((_, i) => <PolicyListSkeleton key={i} />)}
    </div>
  );

export default PolicySkeletons;
