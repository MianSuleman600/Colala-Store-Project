// src/App.js
import React from 'react';
import AppRouter from './routes/AppRouter'; // Import your AppRouter
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


function App() {
    return (
        <div className="App">
             <QueryClientProvider client={queryClient}>
            
            <AppRouter /> {/* Render the AppRouter here */}
            </QueryClientProvider>
        </div>
    );
}

export default App;