import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { ResponsiveContainer } from 'recharts';

const DashboardChart = ({ title, children, height = 300 }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-4">
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
