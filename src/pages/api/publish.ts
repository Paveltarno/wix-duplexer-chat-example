import type { APIRoute } from 'astro';
import { elevate, fetchWithAuth } from '@wix/sdk/context';


const DUPLEXER_API_URL = 'https://www.wix.com/_api/wix-duplexer-api/v3';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { channelName, message, deployPreviewTag } = body;

    if (!channelName || !message) {
      return new Response(
        JSON.stringify({ error: 'channelName and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Duplexer API to publish message using fetchWithAuth
    // Based on PublishRequest proto: channels, event, payload, context
    const requestBody = {
      channels: [channelName],
      event: channelName,
      payload: {message},
      context: 'META_SITE',
    };

    console.log('Duplexer API Request:', {
      url: `${DUPLEXER_API_URL}/publish`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
      deployPreviewTag: deployPreviewTag || 'none',
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (deployPreviewTag) {
      headers['x-wix-route-wix-duplexer-api'] = `dp-${deployPreviewTag}`;
    }

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    };

    const response = await elevate(fetchWithAuth)(`${DUPLEXER_API_URL}/publish`, fetchOptions);

    console.log('Duplexer API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Duplexer API Error Response:', errorData);
      throw new Error(errorData.message || `Failed to publish: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Duplexer API Response Body:', data);

    return new Response(
      JSON.stringify({ success: true, channelName, message, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error publishing message:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to publish message',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

