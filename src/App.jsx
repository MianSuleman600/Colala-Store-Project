// src/App.js
import React from 'react';
import AppRouter from './routes/AppRouter'; // Import your AppRouter


function App() {
    return (
        <div className="App">
            
            <AppRouter /> {/* Render the AppRouter here */}
        </div>
    );
}

export default App;