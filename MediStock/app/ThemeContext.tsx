import React, { createContext, useState, useContext } from 'react';

const lightTheme = {
    colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        background: '#ffffff',
        text: '#333',
        error: '#e74c3c',
        card: '#e6e6e6',
        placeholder: '#333',
    },
};

const darkTheme = {
    colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        background: '#333333',
        text: '#ffffff',
        error: '#e74c3c',
        card: '#5a5a5a',
        placeholder: '#ffffff',
    },
};

const ThemeContext = createContext({
    theme: lightTheme,
    isDarkMode: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
