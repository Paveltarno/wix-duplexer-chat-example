// import type { WixClient } from '@wix/sdk';
// import { createClient } from '@wix/sdk';
// import { dashboard, type Host } from '@wix/dashboard';
// import { useState } from 'react';

// interface UseClientProps {
//   host: Host;
// }

// export type DashboardClientSdk = WixClient<
//   Host,
//   ReturnType<(typeof dashboard)['auth']>,
//   { dashboard: typeof dashboard }
// >;

// export const useClient = ({ host }: UseClientProps): DashboardClientSdk => {
//   const [client] = useState<DashboardClientSdk>(() =>
//     createClient({
//       host,
//       auth: dashboard.auth(),
//       modules: {
//         dashboard,
//       },
//     }),
//   );
//   return client;
// };