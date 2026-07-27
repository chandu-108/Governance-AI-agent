import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const BudgetVisualization = ({ budgetContext }) => {
  if (!budgetContext) return null;

  const limit = Number(budgetContext.monthly_limit || 0);
  const used = Number(budgetContext.monthly_used || 0);
  const remaining = Math.max(0, limit - used);
  
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          Budget Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          <span>Utilization</span>
          <span className="text-gray-900">{pct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, pct)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 95 ? 'bg-orange-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Limit</p>
            <p className="text-sm font-semibold text-gray-800">${limit.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Used</p>
            <p className="text-sm font-semibold text-gray-800">${used.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Remaining</p>
            <p className="text-sm font-semibold text-gray-800">${remaining.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetVisualization;
