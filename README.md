# Wix Duplexer Chat Example

A simple proof-of-concept demonstrating real-time messaging with Wix Duplexer.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create `.env.local` with your Wix app credentials:
```env
WIX_CLIENT_ID="your-app-def-id"
WIX_CLIENT_SECRET="your-client-secret"
WIX_CLIENT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
WIX_CLIENT_INSTANCE_ID="your-instance-id"
```

3. Update `wix.config.json` with your app and site IDs

4. Update the `appDefId` in `src/hooks/use-duplexer-consumer.ts`

## Run

```bash
yarn dev
```

Navigate to `http://localhost:4321/`

## Deploy Preview Support

Enter a deploy preview tag in the UI to test against a specific Duplexer deployment. The tag is persisted in localStorage.

## Debug with Charles

```bash
yarn sniff
```

Requires Charles Proxy running on port 8888.