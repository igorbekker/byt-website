import type { Env } from './_hubspot';
import { jsonResponse } from './_hubspot';

export const onRequestGet = async (context: { request: Request; env: Env }): Promise<Response> => {
  const envKeys = Object.keys(context.env).sort();

  let resendTest: string = 'skipped';
  const resendKey = context.env.RESEND_API_KEY;
  const alertEmail = context.env.ALERT_EMAIL;

  if (resendKey && alertEmail) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'BYT Alerts <alerts@getbetteryou.com>',
          to: [alertEmail],
          subject: '[BYT TEST] Form monitor test',
          text: 'If you received this, Resend integration is working.',
        }),
      });
      const body = await res.text();
      resendTest = `status=${res.status} body=${body}`;
    } catch (err) {
      resendTest = `fetch_error: ${String(err)}`;
    }
  } else {
    resendTest = `missing: RESEND_API_KEY=${!!resendKey}, ALERT_EMAIL=${!!alertEmail}`;
  }

  return jsonResponse(
    {
      envKeys: envKeys,
      alertEmailRaw: String(context.env.ALERT_EMAIL),
      resendKeyPrefix: resendKey ? resendKey.substring(0, 6) + '...' : 'NOT SET',
      resendTest: resendTest,
    },
    200,
  );
};
