import React from 'react';
import { motion } from 'framer-motion';
import { FileCode2, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const PolicyTrace = ({ policies = [] }) => {
  if (!policies || policies.length === 0) return null;

  return (
    <Card className="shadow-sm border-gray-200 mt-4">
      <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-indigo-600" />
          OPA Policy Trace
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {policies.map((policy, idx) => (
            <motion.div
              key={policy.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{policy.name}</p>
                  <p className="text-xs text-gray-500">{policy.description || 'Evaluated via Rego engine'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${policy.enforced ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {policy.enforced ? 'ENFORCED' : 'AUDIT'}
                </span>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyTrace;
