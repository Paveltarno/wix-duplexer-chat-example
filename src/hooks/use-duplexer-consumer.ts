import { useEffect, useRef, useState } from 'react';
import { Duplexer, type InstanceUpdater } from '@wix/duplexer-js';
import { getContextualAuth } from '@wix/sdk-runtime/context';
import { headlessSite } from '@wix/headless-site';
import type { Host } from '@wix/sdk-types';

export function useDuplexerConsumer({ channelName }: { host: Host; channelName: string }) {
  const duplexerRef = useRef<Duplexer | null>(null);
  const host = headlessSite.host;
  const connectionRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!channelName) return;

    const instanceUpdater: InstanceUpdater = {
      getInstance: async () => {
        const authHeaders = await getContextualAuth().getAuthHeaders?.(host);
        return authHeaders?.headers?.Authorization;
      },
    };

    duplexerRef.current = new Duplexer('duplexer.wix.com', { instanceUpdater });

    connectionRef.current = duplexerRef.current.connect({
      appDefId: '22bef345-3c5b-4c18-b782-74d4085112ff',
    });

    connectionRef.current.on('@duplexer:connected', () => {
      console.log('Duplexer connected');
      setIsConnected(true);
    });

    channelRef.current = connectionRef.current.subscribeToUserChannel();
    channelRef.current.on(channelName, (payload: any) => {
      console.log('Received duplexer event:', payload);
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      connectionRef.current?.disconnect();
      duplexerRef.current?.close();
      setIsConnected(false);
    };
  }, [channelName, host]);

  return {
    messages,
    isConnected,
  };
}

