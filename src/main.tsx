// Ensure window.fetch has both a getter and a setter so external/injected scripts can reassign it without throwing
(function () {
  try {
    if (typeof window !== 'undefined') {
      const orig = window.fetch ? window.fetch.bind(window) : undefined;
      let active = orig;
      Object.defineProperty(window, 'fetch', {
        get() {
          return active || (window.fetch ? window.fetch.bind(window) : undefined);
        },
        set(fn) {
          active = fn;
        },
        configurable: true,
        enumerable: true,
      });

      if (window.Window && window.Window.prototype) {
        try {
          const desc = Object.getOwnPropertyDescriptor(window.Window.prototype, 'fetch');
          if (desc && !desc.set) {
            Object.defineProperty(window.Window.prototype, 'fetch', {
              get() {
                return active || (window.fetch ? window.fetch.bind(window) : undefined);
              },
              set(fn) {
                active = fn;
              },
              configurable: true,
              enumerable: true,
            });
          }
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
})();

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
