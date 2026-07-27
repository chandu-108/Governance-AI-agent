import React from 'react';

export const AuditTimelineSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 overflow-hidden animate-pulse">
    <div className="space-y-8 relative">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100" />
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="relative pl-10 flex gap-4">
          <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-gray-200 ring-4 ring-white" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
          </div>
          <div className="w-24 text-right">
            <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AuditTableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-4">
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-3 w-32 bg-gray-200 rounded" />
    </div>
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="px-6 py-4 border-b border-gray-100 flex gap-4 items-center">
        <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
        <div className="w-20 h-6 bg-gray-100 rounded-full flex-shrink-0" />
      </div>
    ))}
  </div>
);
