import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(
    (window.electron.store.get('theme') as Theme) || 'system',
  );

  // Listen for theme change event sent from menu bar
  // and update theme state in navbar component
  window.electron.ipcRenderer.on('change-theme', (arg) => {
    setTheme(arg as Theme);
  });

  useEffect(() => {
    const updateThemeClass = (theme: Theme) => {
      const root = document.getElementsByTagName('body')[0] as HTMLElement;
      root.classList.remove('light', 'dark', 'system');
      root.classList.add(theme);
    };

    // Save setting to store
    window.electron.store.set('theme', theme);
    // Send update event so that menu can update/rebuild
    window.electron.ipcRenderer.sendMessage('change-theme', [theme]);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateThemeClass(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Update the theme class on the root tag
    if (theme === 'system') {
      updateThemeClass(mediaQuery.matches ? 'dark' : 'light');
    } else {
      updateThemeClass(theme);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
