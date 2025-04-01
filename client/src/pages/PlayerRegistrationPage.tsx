import { Link } from "react-router-dom";
import PlayerRegistrationForm from "@/components/players/PlayerRegistrationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PlayerRegistrationPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <Link to="/" className="flex justify-center mb-5">
            <h1 className="text-3xl font-bold text-bidfy-blue">BidFy</h1>
          </Link>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Player Registration</CardTitle>
              <CardDescription>
                Submit your details to register as a player for the upcoming auctions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerRegistrationForm />
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Already registered? <Link to="/login" className="text-bidfy-blue hover:underline">Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerRegistrationPage;