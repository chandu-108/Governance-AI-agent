import React from 'react';
import { Card, CardContent } from './Card';

const LoadingSkeleton = ({ count = 1, type = 'card' }) => {
  const renderSkeletons = () => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse">
        {type === 'card' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        )}
        {type === 'chart' && (
          <Card>
            <CardContent className="p-6 h-[300px] flex flex-col justify-end gap-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-auto"></div>
              <div className="w-full h-full bg-gray-100 rounded mt-4"></div>
            </CardContent>
          </Card>
        )}
        {type === 'list' && (
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        )}
      </div>
    ));
  };

  return <>{renderSkeletons()}</>;
};

export default LoadingSkeleton;
