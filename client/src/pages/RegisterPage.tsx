import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center mb-5">
            <h1 className="text-3xl font-bold text-bidfy-blue">BidFy</h1>
          </Link>
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <RegisterForm />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Are you a player looking to register? <Link to="/player-registration" className="text-bidfy-blue hover:underline font-medium">Register as a player</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;