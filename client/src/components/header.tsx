import logo from "@/assets/an_logo.png";
import { Button } from "./ui/button";
import { useAuth } from "@/AuthContext";
import { NavLink } from "react-router";
import { toast } from "sonner";

export default function Header() {
    const { role, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };
    return (
        <header className="container mx-auto px-4 py-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="mr-6">
                <img src={logo} alt="Anime Nights logo" className="h-14" />
            </div>
            <div className="flex-1 flex justify-end">
                {isAuthenticated ? (
                    <div className="flex flex-col justify-center items-center">
                        <h1>Authenticated as {role}</h1>
                        <Button
                            onClick={handleLogout}
                            className="bg-gray-700 text-white cursor-pointer mt-2"
                        >
                            Log Out
                        </Button>
                    </div>
                ) : (
                    <NavLink to="/login">
                        <Button className="bg-gray-700 text-white cursor-pointer">
                            Log In
                        </Button>
                    </NavLink>
                )}
            </div>
        </header>
    );
}
