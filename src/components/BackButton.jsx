import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go one step back in history
  };

  return (
    <button 
      onClick={handleBack}
      className="bg-gray-900 hover:bg-gray-500 text-gray-300 text-xs py-1 px-1 rounded"
    >
       ⮐ Back
    </button>
  );
};

export default BackButton;