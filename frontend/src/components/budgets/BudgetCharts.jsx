import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

const BudgetCharts = ({ budgets = [], agents = [] }) => {
  const chartData = useMemo(() => {
    // 1. Agent spending vs limits
    const agentSpending = budgets.map((b) => {
      const agent = agents.find((a) => a.id === b.agent_id);
      return {
        name: agent?.name || `Agent #${b.agent_id}`,
        limit: Number(b.monthly_limit),
        used: Number(b.monthly_used),
      };
    });

    // 2. Budget distribution categories
    let healthy = 0;
    let warning = 0;
    let critical = 0;
    let exceeded = 0;

    budgets.forEach((b) => {
      const limit = Number(b.monthly_limit);
      const used = Number(b.monthly_used);
      const pct = limit > 0 ? (used / limit) * 100 : 0;
      if (pct >= 100) exceeded++;
      else if (pct >= 95) critical++;
      else if (pct >= b.warning_threshold) warning++;
      else healthy++;
    });

    const statusDist = [
      { name: 'Healthy (<80%)', value: healthy, color: '#10b981' },
      { name: 'Warning (80-95%)', value: warning, color: '#f59e0b' },
      { name: 'Critical (95-100%)', value: critical, color: '#f97316' },
      { name: 'Exceeded (>=100%)', value: exceeded, color: '#ef4444' },
    ].filter((d) => d.value > 0);

    return { agentSpending, statusDist };
  }, [budgets, agents]);

  if (budgets.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Agent-wise Spending vs Limit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-800">Agent Spending vs Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.agentSpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="used" name="Used ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="limit" name="Limit ($)" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-800">Budget Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="h-64 w-full flex items-center justify-center">
            {chartData.statusDist.length === 0 ? (
              <span className="text-sm text-gray-400">No utilization data</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.statusDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {chartData.statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCharts;
