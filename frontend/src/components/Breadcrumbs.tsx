import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Split path into segments and filter out empty strings
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <span key={to}> / {value}</span>
        ) : (
          <span key={to}>
            {" "} / <Link to={to}>{value}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;