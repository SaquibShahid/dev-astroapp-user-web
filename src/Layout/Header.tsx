import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-bg">
      <div className="container-custom flex items-center justify-between py-4">
        <Link to="/" className="text-lg font-bold text-primary">
          Logo
        </Link>
      </div>
    </header>
  );
};

export default Header;
