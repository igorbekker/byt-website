import type { Env } from './_hubspot';
import { CORS_HEADERS, jsonResponse } from './_hubspot';

export const onRequestGet = async (context: { request: Request; env: Env }): Promise<Response> => {
  const hasResendKey = !!context.env.RESEND_API_KEY;
  const hasAlertEmail = !!context.env.ALERT_EMAIL;
  const resendKeyPrefix = context.env.RESEND_API_KEY
    ? context.env.RESEND_API_KEY.substring(0, 6) + '...'
    : 'NOT SET';
  const alertEmail = context.env.ALERT_EMAIL || 'NOT SET';

  return jsonResponse(
    {
      resendKeyExists: hasResendKey,
      resendKeyPrefix: resendKeyPrefix,
      alertEmailExists: hasAlertEmail,
      alertEmail: alertEmail,
    },
    200,
  );
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
