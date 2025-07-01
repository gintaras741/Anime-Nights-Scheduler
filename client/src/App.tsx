import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./Homepage";
import { Routes, Route } from "react-router";
import Header from "./components/header";
import CosplayPage from "./CosplayPage";
import PrejudgePage from "./PrejudgePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CosplayEditPage from "./CosplayEditPage";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./LoginPage";
import UserCosplayPage from "./UserCosplayPage";
import UserPrejudgePage from "./UserPrejudgePage";
import ProfilePage from "./ProfilePage";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="min-h-screen bg-gray-950 text-white flex flex-col">
                    <Header />
                    <Toaster />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/cosplay"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["user", "admin"]}
                                >
                                    <UserCosplayPage />
                                </ProtectedRoute>
                            }
                        ></Route>
                        <Route
                            path="/prejudge"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["user", "admin"]}
                                >
                                    <UserPrejudgePage />
                                </ProtectedRoute>
                            }
                        ></Route>
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["user", "admin"]}
                                >
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        ></Route>
                        <Route
                            path="/admin/cosplay"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <CosplayPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/prejudge"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <PrejudgePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/edit"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <CosplayEditPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="*"
                            element={<div>404 Page Not Found</div>}
                        />
                    </Routes>
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
