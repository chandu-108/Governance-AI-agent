import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Activity } from 'lucide-react';
import { agentsService } from '../services/agents';
import { auditService } from '../services/audit';
import { governanceService } from '../services/governance';

import GovernanceForm from '../components/governance/GovernanceForm';
import GovernancePipeline from '../components/governance/GovernancePipeline';
import DecisionCard from '../components/governance/DecisionCard';
import BudgetVisualization from '../components/governance/BudgetVisualization';
import PolicyTrace from '../components/governance/PolicyTrace';
import AuditSummary from '../components/governance/AuditSummary';
import Timeline from '../components/governance/Timeline';

const Governance = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [evalStatus, setEvalStatus] = useState('idle'); // idle, success, error
  const [result, setResult] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 60_000,
  });

  const { data: auditLogs = [], refetch: refetchAudit } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: auditService.getAll,
    staleTime: 10_000,
  });

  const handleEvaluate = async (formData) => {
    setIsEvaluating(true);
    setResult(null);
    setEvalStatus('idle');
    setTimelineEvents([]);
    setCurrentStage(1);

    const addEvent = (label, status) => {
      setTimelineEvents(prev => [...prev, { label, status, timestamp: new Date() }]);
    };

    try {
      // Simulate pipeline progression
      addEvent('Request Initiated', 'success');
      await new Promise(r => setTimeout(r, 600));
      setCurrentStage(2);
      addEvent('Agent Verified', 'success');
      
      await new Promise(r => setTimeout(r, 600));
      setCurrentStage(3);
      addEvent('Permissions Checked', 'success');
      
      await new Promise(r => setTimeout(r, 600));
      setCurrentStage(4);
      addEvent('Budget Validated', 'success');
      
      await new Promise(r => setTimeout(r, 600));
      setCurrentStage(5);
      
      // Actual API Call
      const evalResult = await governanceService.evaluate({
        agent_id: formData.agent_id,
        action: formData.action
      });
      
      // Complete remaining stages
      addEvent('Policies Evaluated', evalResult.allowed ? 'success' : 'error');
      setCurrentStage(6);
      await new Promise(r => setTimeout(r, 400));
      
      addEvent('Audit Recorded', 'success');
      setCurrentStage(7);
      await new Promise(r => setTimeout(r, 400));
      
      setResult(evalResult);
      setEvalStatus(evalResult.allowed ? 'success' : 'error');
      addEvent(`Decision: ${evalResult.allowed ? 'ALLOW' : 'DENY'}`, evalResult.allowed ? 'success' : 'error');
      
      // Refresh audit logs in background
      refetchAudit();
    } catch (err) {
      console.error(err);
      setEvalStatus('error');
      addEvent('Evaluation Failed', 'error');
      setResult({ allowed: false, reason: 'Evaluation engine encountered an error' });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = useCallback(() => {
    setIsEvaluating(false);
    setCurrentStage(0);
    setEvalStatus('idle');
    setResult(null);
    setTimelineEvents([]);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Governance Evaluation Center</h1>
        </div>
        <p className="text-sm text-gray-500">
          Simulate and analyze real-time governance decisions across RBAC, budgets, and OPA policies.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="xl:col-span-3 space-y-6">
          <GovernanceForm
            agents={agents}
            onSubmit={handleEvaluate}
            isEvaluating={isEvaluating}
            onReset={handleReset}
          />
        </div>

        {/* Center Column: Pipeline & Result Visualizations */}
        <div className="xl:col-span-6 space-y-6">
          <GovernancePipeline
            currentStage={currentStage}
            status={evalStatus}
            isEvaluating={isEvaluating}
          />
          
          <Timeline events={timelineEvents} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BudgetVisualization budgetContext={result?.context?.budget} />
            <PolicyTrace policies={result?.context?.policies} />
          </div>
        </div>

        {/* Right Column: Decision & Audit */}
        <div className="xl:col-span-3 space-y-6 flex flex-col h-full">
          <div className="flex-1">
            <DecisionCard result={result} isEvaluating={isEvaluating} />
          </div>
          <div className="flex-1">
            <AuditSummary logs={auditLogs} agents={agents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
