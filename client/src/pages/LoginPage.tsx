
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center mb-5">
            <h1 className="text-3xl font-bold text-bidfy-blue">BidFy</h1>
          </Link>
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
