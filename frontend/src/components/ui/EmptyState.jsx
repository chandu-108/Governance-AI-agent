import React from 'react';
import { Card, CardContent } from './Card';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = "No data available", description = "There is currently no data to display in this section.", icon: Icon = Inbox }) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
