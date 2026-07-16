import { useEffect } from 'react';

export function useKeyboardShortcut(key, callback, metaKey = true) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for meta (Cmd on Mac, Ctrl on Windows) if required
      if (metaKey && !(event.metaKey || event.ctrlKey)) return;
      
      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, metaKey]);
}
