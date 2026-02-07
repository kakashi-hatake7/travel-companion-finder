import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark', !darkMode);
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
    };

    return (
        <button onClick={toggleDarkMode} className="fixed bottom-4 right-4 z-50 p-3 bg-slate-100 dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-slate-300 dark:border-slate-700" aria-label="Toggle dark mode" title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
                <Moon className="h-6 w-6 text-slate-700" />
            )}
        </button>
    );
};

export default DarkModeToggle;