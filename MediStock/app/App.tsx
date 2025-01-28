import React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Navigation/>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
