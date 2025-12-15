/**
 * Session Store (Zustand)
 *
 * Centralized state management for verification session
 * Manages: current stage, submission status, agent messages, form data
 */

import { create } from 'zustand';

export type SessionStage = 'case_id' | 'credentials' | 'secret_key' | 'kyc' | 'completed' | 'terminated';
export type SessionStatus = 'idle' | 'submitting' | 'waiting' | 'approved' | 'rejected' | 'error';

export interface SessionState {
  // Session metadata
  sessionUuid: string | null;
  caseId: string | null;
  guestToken: string | null;
  stage: SessionStage;
  status: SessionStatus;

  // Agent communication
  agentMessage: string | null;

  // Form data (current stage only)
  formData: Record<string, any>;

  // UI state
  loading: boolean;
  error: string | null;

  // Tracking
  connectionAttempts: number;

  // Actions
  setSession: (uuid: string, caseId?: string, guestToken?: string) => void;
  setCaseId: (caseId: string) => void;
  setStage: (stage: SessionStage) => void;
  setStatus: (status: SessionStatus) => void;
  setAgentMessage: (message: string | null) => void;
  setFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  incrementConnectionAttempts: () => void;
  reset: () => void;
}

const initialState = {
  sessionUuid: null,
  caseId: null,
  guestToken: null,
  stage: 'case_id' as SessionStage,
  status: 'idle' as SessionStatus,
  agentMessage: null,
  formData: {},
  loading: false,
  error: null,
  connectionAttempts: 0,
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,

  setSession: (uuid: string, caseId?: string, guestToken?: string) => set({ sessionUuid: uuid, caseId: caseId || null, guestToken: guestToken || null }),

  setCaseId: (caseId: string) => set({ caseId }),

  setStage: (stage: SessionStage) => set({ stage }),

  setStatus: (status: SessionStatus) => set({ status }),

  setAgentMessage: (message: string | null) => set({ agentMessage: message }),

  setFormData: (data: Record<string, any>) => set({ formData: data }),

  clearFormData: () => set({ formData: {} }),

  setError: (error: string | null) => set({ error }),

  setLoading: (loading: boolean) => set({ loading }),

  incrementConnectionAttempts: () =>
    set((state) => ({ connectionAttempts: state.connectionAttempts + 1 })),

  reset: () => set(initialState),
}));



/**
 * Hook to get current session
 */
export function useSession() {
  return useSessionStore((state) => ({
    sessionUuid: state.sessionUuid,
    stage: state.stage,
    status: state.status,
    agentMessage: state.agentMessage,
    formData: state.formData,
    loading: state.loading,
    error: state.error,
  }));
}
