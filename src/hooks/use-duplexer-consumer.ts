import { useEffect, useRef, useState } from 'react';
import { Duplexer, type InstanceUpdater } from '@wix/duplexer-js';
import { getContextualAuth } from '@wix/sdk-runtime/context';
import { headlessSite } from '@wix/headless-site';
import type { Host } from '@wix/sdk-types';

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export function useDuplexerConsumer({ channelName }: { host: Host; channelName: string; deployPreviewTag?: string }) {
  const duplexerRef = useRef<Duplexer | null>(null);
  const host = headlessSite.host;
  const connectionRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    if (!channelName) return;

    setConnectionState('connecting');

    const instanceUpdater: InstanceUpdater = {
      getInstance: async () => {
        const authHeaders = await getContextualAuth().getAuthHeaders?.(host);
        return authHeaders?.headers?.Authorization;
      },
    };

    const timeline = {
      log(event: any) {
        console.log('[Duplexer Timeline]', event.type, event.data);
      }
    };

    duplexerRef.current = new Duplexer('duplexer.wix.com', { 
      instanceUpdater, 
      timeline
    });

    connectionRef.current = duplexerRef.current.connect({
      appDefId: '22bef345-3c5b-4c18-b782-74d4085112ff',
    });

    connectionRef.current.on('@duplexer:connected', () => {
      console.log('Duplexer connected');
      setConnectionState('connected');
    });

    connectionRef.current.on('@duplexer:error', () => {
      console.log('Duplexer connection error');
      setConnectionState('disconnected');
    });

    channelRef.current = connectionRef.current.subscribe(channelName);
    channelRef.current.on(channelName, (payload: any) => {
      console.log('Received duplexer event:', payload);
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      connectionRef.current?.disconnect();
      duplexerRef.current?.close();
      setConnectionState('disconnected');
    };
  }, [channelName, host]);

  return {
    messages,
    connectionState,
  };
}

