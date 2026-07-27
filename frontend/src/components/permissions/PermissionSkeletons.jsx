import React from 'react';

const PermCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-1 w-full bg-gray-200" />
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="w-16 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const PermListSkeleton = () => (
  <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-gray-100">
    <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="hidden lg:flex gap-2">
      <div className="w-16 h-5 rounded-full bg-gray-200" />
      <div className="w-14 h-5 rounded-full bg-gray-200" />
    </div>
    <div className="w-20 h-3 rounded bg-gray-200 hidden md:block" />
  </div>
);

const PermissionSkeletons = ({ count = 6, viewMode = 'grid' }) =>
  viewMode === 'grid' ? (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => <PermCardSkeleton key={i} />)}
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {Array(count).fill(0).map((_, i) => <PermListSkeleton key={i} />)}
    </div>
  );

export default PermissionSkeletons;
