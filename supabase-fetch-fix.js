(() => {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!url.startsWith('https://xawvgrktcqbtmcbpuizg.supabase.co/')) return originalFetch(input, init);
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const auth = headers.get('Authorization') || '';
    if (auth.startsWith('Bearer sb_publishable_')) headers.delete('Authorization');
    return originalFetch(input, { ...init, headers });
  };
})();