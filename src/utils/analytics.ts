type TrackPayload = Record<string, any> | undefined;

// Helper to compute a readable view name from route path
export const getViewNameFromPath = (pathname: string): { name: string; payload?: TrackPayload } | null => {
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/ftu') return { name: 'ftu' };
  if (pathname === '/menu') return { name: 'menu' };
  if (pathname === '/sources') return { name: 'sources' };
  if (pathname.startsWith('/sources/')) {
    // Attempt to attach the id if present
    const id = pathname.split('/')[2];
    return { name: 'source_profile', payload: id ? { id } : undefined };
  }
  if (pathname === '/discover') return { name: 'discover' };
  if (pathname === '/settings') return { name: 'settings' };
  if (pathname === '/statistics') return { name: 'statistics' };
  return null;
};

