import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            const isDarkMode = JSON.parse(stored);
            setIsDark(isDarkMode);
            applyDarkMode(isDarkMode);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
            applyDarkMode(prefersDark);
        }
    }, []);

    const applyDarkMode = (isDarkMode) => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    };

    const toggleDarkMode = () => {
        setIsDark(prev => {
            const newState = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newState));
            applyDarkMode(newState);
            return newState;
        });
    };

    return { isDark, toggleDarkMode };
}