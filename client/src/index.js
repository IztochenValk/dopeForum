import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { store, persistor } from './redux/store';
import './styles/global.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </PersistGate>
    </Provider>
);
