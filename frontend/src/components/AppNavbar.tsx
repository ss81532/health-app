import { NavLink } from "react-router-dom";
import "./AppNavbar.css";
import { Link } from 'react-router-dom';
export default function AppNavbar() {
  return (
    <nav className="app-navbar">
      <div className="nav-left">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="logo">HealthApp</span>
              </Link>
      </div>

      <div className="nav-links">
        <NavLink to="/families" className={({ isActive }) => isActive ? "active" : ""}>
          Families
        </NavLink>
      </div>
    </nav>
  );
}
