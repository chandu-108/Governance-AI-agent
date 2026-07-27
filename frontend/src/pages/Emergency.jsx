import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

import { emergencyService } from '../services/emergency';
import { agentsService } from '../services/agents';
import { useToast } from '../components/ui/Toast';

import EmergencyStatusCard from '../components/emergency/EmergencyStatusCard';
import EmergencyToggle from '../components/emergency/EmergencyToggle';
import EmergencyDialog from '../components/emergency/EmergencyDialog';
import EmergencyHistory from '../components/emergency/EmergencyHistory';
import WarningBanner from '../components/emergency/WarningBanner';

const Emergency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const { data: status, isLoading, isError, refetch } = useQuery({
    queryKey: ['emergencyStatus'],
    queryFn: emergencyService.getStatus,
    refetchInterval: 5000, // Auto-refresh status every 5 seconds for mission control feel
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    staleTime: 60_000,
  });

  const enableMutation = useMutation({
    mutationFn: emergencyService.enableGlobal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyStatus'] });
      setDialogOpen(false);
      toast({ title: 'Emergency Stop Activated', description: 'All agent operations have been suspended.', variant: 'destructive', duration: 6000 });
    },
    onError: () => toast({ title: 'Failed to activate emergency stop', variant: 'destructive' }),
  });

  const disableMutation = useMutation({
    mutationFn: emergencyService.disableGlobal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyStatus'] });
      setDialogOpen(false);
      toast({ title: 'Operations Restored', description: 'AI agents have resumed normal processing.', variant: 'success', duration: 6000 });
    },
    onError: () => toast({ title: 'Failed to restore operations', variant: 'destructive' }),
  });

  const handleToggleClick = () => {
    setIsActivating(!status?.global_stop?.enabled);
    setDialogOpen(true);
  };

  const handleConfirm = (reason) => {
    if (isActivating) {
      enableMutation.mutate(reason);
    } else {
      disableMutation.mutate();
    }
  };

  const isEmergency = status?.global_stop?.enabled;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load system status</h3>
        <p className="text-sm text-gray-500 mb-5">Could not reach the emergency control server.</p>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <WarningBanner isEmergency={isEmergency} reason={status?.global_stop?.reason} />
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${isEmergency ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Mission Control</h1>
        </div>
        <p className="text-sm text-gray-500">
          Global operations center for emergency platform overrides.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full"></div>
        </div>
      ) : (
        <>
          <EmergencyStatusCard status={status} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <EmergencyToggle 
              isEmergency={isEmergency} 
              onToggle={handleToggleClick} 
            />
            <EmergencyHistory 
              agentStops={status?.agent_stops || []} 
              agents={agents} 
            />
          </div>
        </>
      )}

      <EmergencyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        isActivating={isActivating}
        isLoading={enableMutation.isPending || disableMutation.isPending}
      />
    </div>
  );
};

export default Emergency;
