import { useLocation, useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const isFromLogin = location.state?.fromLogin;
    const isMainPage = location.pathname === "/post/feed";
    if (isMainPage && isFromLogin) {
      // Don't go back if we came from login
      return;
    }
    navigate(-1); // Go one step back in history
  };

  return (
    <button 
      onClick={handleBack}
      className="bg-gray-900 hover:bg-gray-500 text-gray-300 text-xs py-2 px-3 rounded"
    >
       ⮐
    </button>
  );
};

export default BackButton;