import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { onCLS, onINP, onLCP } from 'web-vitals';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';
import './i18n';

// Web Vitals monitoring
function sendToAnalytics(metric: any) {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', metric.name, {
      value: metric.delta,
      metric_id: metric.id,
      metric_label: metric.name,
      non_interaction: true,
    });
  }
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SarkariBoard ServiceWorker registered successfully with scope:', registration.scope);
      })
      .catch((err) => {
        console.warn('SarkariBoard ServiceWorker registration declined or blocked by frame sandbox environment:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
