import {
  MdAdd,
  MdHomeFilled,
  MdLightMode,
  MdDarkMode,
  MdExpandMore,
} from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, Tooltip } from 'flowbite-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isRoot = location.pathname === '/';
  const textColorClass = isRoot
    ? 'text-blue-500'
    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300';
  const activeDropdownItemClass = 'text-blue-500 dark:text-blue-500';

  const ThemeToggleButton = () => {
    return (
      <Tooltip
        animation="duration-500"
        content={`Zamenjaj na ${theme === 'light' ? 'temen' : 'svetel'} izgled`}
      >
        <button
          onClick={toggleTheme}
          id="dropdownMenuIconButton"
          className="inline-flex items-center rounded-s-lg bg-white p-[9px] text-center text-lg font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
          type="button"
        >
          {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
        </button>
      </Tooltip>
    );
  };
  const DropdownToggleButton = () => {
    return (
      <Tooltip animation="duration-500" content="Izberi temo">
        <button
          id="dropdownMenuIconButton"
          className="inline-flex items-center rounded-e-lg bg-white p-[9px] text-center text-lg font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
          type="button"
        >
          <MdExpandMore />
        </button>
      </Tooltip>
    );
  };

  return (
    <nav className="relative flex items-center justify-between border-b-[1px] border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <Tooltip
        theme={{ target: 'flex items-center' }}
        animation="duration-500"
        content="Pojdi domov"
      >
        <button onClick={() => navigate('/')}>
          <MdHomeFilled
            className={`text-2xl transition-colors ${textColorClass}`}
          />
        </button>
      </Tooltip>

      <div className="flex items-center gap-4">
        <div className="inline-flex rounded-md" role="group">
          <ThemeToggleButton />
          <Dropdown
            className="w-28"
            arrowIcon={false}
            inline={true}
            label={<DropdownToggleButton />}
          >
            <Dropdown.Header className="py-1">
              <span className="block text-sm text-gray-400">Tema</span>
            </Dropdown.Header>
            <Dropdown.Item
              className={`${
                theme === 'system' ? activeDropdownItemClass : null
              }`}
              onClick={() => setTheme('system')}
            >
              Sistemska
            </Dropdown.Item>
            <Dropdown.Item
              className={`${
                theme === 'light' ? activeDropdownItemClass : null
              }`}
              onClick={() => setTheme('light')}
            >
              Svetla
            </Dropdown.Item>
            <Dropdown.Item
              className={`${theme === 'dark' ? activeDropdownItemClass : null}`}
              onClick={() => setTheme('dark')}
            >
              Temna
            </Dropdown.Item>
          </Dropdown>
        </div>

        {/* <button
          className="flex items-center whitespace-nowrap rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-white"
          tabIndex={0}
          onClick={() => navigate('/order')}
        >
          <MdAdd className="mr-2 inline-block" />
          Novo naročilo
        </button> */}
        <Tooltip animation="duration-500" content="Novo naročilo">
          <button
            type="button"
            tabIndex={0}
            onClick={() => navigate('/order')}
            className="inline-flex items-center rounded-lg bg-white p-1.5 text-center text-2xl font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
          >
            <MdAdd />
            <span className="sr-only">Novo naročilo</span>
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Navbar;
