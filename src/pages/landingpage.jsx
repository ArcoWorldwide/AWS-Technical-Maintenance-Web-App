import Button from "../components/atoms/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants/permissions";
import logo from "../assets/aws-img/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const handleLogin = (role) => {
    loginAsRole(role);
    navigate("/dashboard"); // everyone goes to same dashboard
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#3C498B] shadow-sm">
        <div className="container mx-auto flex items-center px-3 sm:px-4 md:px-6">
          <img
            src={logo}
            alt="Arco Worldwide Services Logo"
            className="h-16 sm:h-18 md:h-20 lg:h-28 w-auto object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 md:px-8 max-w-2xl">
          <h2 className="font-semibold mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3C498B] leading-tight">
            Welcome to AWS Maintenance
          </h2>

          <p className="text-gray-700 mb-8 text-sm sm:text-base md:text-lg">
            Select your role to log into the maintenance management system.
          </p>

{/* Role-based Login Buttons */}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4">
  <Button
    bgColor="#B22C2F"
    color="#FFFFFF"
    width="160px"
    height="40px"
    fontSize="14px"
    fontWeight="600"
    className="rounded-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    onClick={() => handleLogin(ROLES.ADMIN)}
  >
    Admin
  </Button>

  <Button
    bgColor="#3C498B"
    color="#FFFFFF"
    width="160px"
    height="40px"
    fontSize="14px"
    fontWeight="600"
    className="rounded-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    onClick={() => handleLogin(ROLES.TECHNICAL)}
  >
    Technical
  </Button>

  <Button
    bgColor="#4B5563"
    color="#FFFFFF"
    width="160px"
    height="40px"
    fontSize="14px"
    fontWeight="600"
    className="rounded-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    onClick={() => handleLogin(ROLES.GENERAL)}
  >
    General
  </Button>
</div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3C498B] text-white py-3 sm:py-4">
        <div className="container mx-auto text-center text-xs sm:text-sm px-4">
          <p>&copy; 2026 AWS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
