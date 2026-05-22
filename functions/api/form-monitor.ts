import type { Env } from './_hubspot';
import { CORS_HEADERS, jsonResponse, reportFormError } from './_hubspot';

interface ErrorReport {
  form: string;
  errorType: string;
  httpStatus?: number;
  message: string;
  payload?: Record<string, unknown>;
  userAgent?: string;
  timestamp: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  let report: ErrorReport;
  try {
    report = (await context.request.json()) as ErrorReport;
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  if (!report.form || !report.message) {
    return jsonResponse({ success: false, error: 'Missing form or message' }, 400);
  }

  const fullMessage = report.userAgent
    ? `${report.message}\n\nUser Agent: ${report.userAgent}`
    : report.message;

  await reportFormError(
    report.form,
    report.errorType || 'client_error',
    fullMessage,
    context.env,
    report.payload,
    report.httpStatus,
  );

  return jsonResponse({ success: true }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
