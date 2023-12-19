import { MdAdd, MdHomeFilled } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = location.pathname === '/';
  const textColorClass = isRoot ? 'text-blue-500' : 'text-gray-500';

  return (
    <nav className="relative flex items-center justify-between border-b-[1px] border-gray-200 bg-white p-4">
      <button onClick={() => navigate('/')}>
        <MdHomeFilled className={`text-2xl ${textColorClass}`} />
      </button>

      <button
        className="flex items-center whitespace-nowrap rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-white"
        tabIndex={0}
        onClick={() => navigate('/order')}
      >
        <MdAdd className="mr-2 inline-block" />
        Novo naročilo
      </button>
    </nav>
  );
};

export default Navbar;
