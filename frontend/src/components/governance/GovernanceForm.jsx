import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play, RotateCcw, ChevronDown, Activity, Code2, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const schema = z.object({
  agent_id: z.coerce.number().int().min(1, 'Agent is required'),
  action: z.string().min(1, 'Action is required'),
});

const GovernanceForm = ({ agents, onSubmit, isEvaluating, onReset }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      agent_id: '',
      action: 'EXECUTE',
    }
  });

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <Card className="h-full border-gray-200 shadow-sm relative overflow-hidden bg-white/50 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          Evaluation Request
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Agent</label>
              <div className="relative">
                <select
                  {...register('agent_id')}
                  className="w-full pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                  disabled={isEvaluating}
                >
                  <option value="">Select an Agent...</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (ID #{a.id})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.agent_id && <p className="mt-1 text-xs text-red-500">{errors.agent_id.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Action</label>
              <div className="relative">
                <select
                  {...register('action')}
                  className="w-full pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                  disabled={isEvaluating}
                >
                  <option value="EXECUTE">EXECUTE (Run Agent Action)</option>
                  <option value="READ">READ (Query Data)</option>
                  <option value="WRITE">WRITE (Modify Resource)</option>
                  <option value="ADMIN">ADMIN (Superuser Override)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.action && <p className="mt-1 text-xs text-red-500">{errors.action.message}</p>}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isEvaluating}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={isEvaluating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GovernanceForm;
