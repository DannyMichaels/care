import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Nest as ProvidersNest } from './components/Helpers/Nest';
import { appProviders } from './utils/appProviders';
import { setStorage, setBaseUrl } from '@care/shared';

// Initialize shared package with web storage adapter
setStorage({
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
});

// Set API base URL based on environment
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://care-api-k1b8.onrender.com/'
    : 'http://localhost:3005';
setBaseUrl(baseUrl);

ReactDOM.render(
  <>
    <Router>
      <ProvidersNest elements={ appProviders }>
        <App />
      </ProvidersNest>
    </Router>
  </>,
  document.getElementById('root')
);

reportWebVitals();

// Register service worker for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
