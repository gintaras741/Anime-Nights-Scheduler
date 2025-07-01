import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Lock, User } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "./AuthContext";

export default function HomePage() {
    const { role } = useAuth();
    return (
        <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
            <div className="max-w-md w-full mx-auto space-y-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Schedule
                    </h2>
                    <p className="text-gray-400">
                        Select an option to view times
                    </p>
                </div>

                {/* Main Buttons */}
                <div className="space-y-4">
                    {/* Cosplay Times Button/Card */}
                    <Card className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white">
                                        Cosplay Times
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        View cosplay competition schedule and
                                        stage times
                                    </p>
                                </div>
                                <NavLink to="/cosplay">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        View
                                    </Button>
                                </NavLink>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prejudge Times Button/Card */}
                    <Card className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white">
                                        Prejudge Times
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        View the prejudge schedule
                                    </p>
                                </div>
                                <NavLink to="/prejudge">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        View
                                    </Button>
                                </NavLink>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                                    <User className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white">
                                        Profile
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        View your times and details
                                    </p>
                                </div>
                                <NavLink to="/profile">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        View
                                    </Button>
                                </NavLink>
                            </div>
                        </CardContent>
                    </Card>
                    {role == "admin" && (
                        <Card className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
                            <CardContent className="pr-6 pl-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                                        <Lock className="h-6 w-6 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-white">
                                            Admin Panel
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            View and manage schedules
                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <NavLink to="/admin/cosplay">
                                            <Button
                                                variant="outline"
                                                className=" w-full cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                Cosplay
                                            </Button>
                                        </NavLink>
                                        <NavLink to="/admin/prejudge">
                                            <Button
                                                variant="outline"
                                                className="w-full cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                Prejudge
                                            </Button>
                                        </NavLink>
                                        <NavLink to="/admin/edit">
                                            <Button
                                                variant="outline"
                                                className="w-full cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                Edit
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Info Card */}
                <Card className="bg-gray-900 border-gray-800 mt-8">
                    <CardContent className="p-6 text-center">
                        <p className="text-xl text-gray-400">
                            Next event:{" "}
                            <span className="text-white">Anime Nights '26</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
