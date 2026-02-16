import { NavLink } from "react-router-dom";
import "./AppNavbar.css";
import { Link } from 'react-router-dom';
import { Calendar } from "react-bootstrap-icons";
export default function AppNavbar() {
  return (
    <nav className="app-navbar">
      <div className="nav-left">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="logo">HealthApp</span>
              </Link>
      </div>

      <div className="nav-links">
              <NavLink
          to="/appointments"
          className="nav-link d-flex align-items-center gap-2"
        >
          <Calendar size={18} />
          Appointments
        </NavLink>
      </div>
    </nav>
  );
}
