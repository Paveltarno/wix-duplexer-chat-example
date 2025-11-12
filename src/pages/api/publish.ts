import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json();
  const { channelName, message } = body;

  // TODO: Implement Duplexer publish logic here

  return new Response(
    JSON.stringify({ success: true, channelName, message }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

