import { createRoot } from 'react-dom/client';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store, persistor } from './store/redux.js';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_ID;
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <PayPalScriptProvider
                    options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}
                >
                    <App />
                </PayPalScriptProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
