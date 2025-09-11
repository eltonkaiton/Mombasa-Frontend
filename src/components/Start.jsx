import React from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
  const navigate = useNavigate(); // ✅ get the navigate function

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm" style={{ minHeight: '200px' }}>
        <h2 className="text-center mb-4">Login As</h2>

        {/* Side-by-side buttons */}
        <div className="d-flex justify-content-between mt-5 mb-2">
          
          <button type="button" className="btn btn-success" onClick={() => navigate('/adminlogin')}>Admin</button>
        </div>
      </div>
    </div>
  );
};

export default Start;
