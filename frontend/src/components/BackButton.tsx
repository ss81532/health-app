import { useNavigate, useLocation } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the back button if we are already on the home page
  if (location.pathname === '/families') return null;

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="btn btn-primary"
      
    >
      ← Back
    </button>
  );
};