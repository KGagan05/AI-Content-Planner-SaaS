import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || 'https://pvns8pz7.us-east.insforge.app';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'ik_a1f41892de27ea33eccfbaf269777770';

export const insforge = createClient({
    baseUrl,
    anonKey
});
