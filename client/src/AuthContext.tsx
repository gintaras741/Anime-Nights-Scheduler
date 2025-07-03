import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [key, setKey] = useState(() => localStorage.getItem("key") || null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    const login = async (key: string) => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/verifykey",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        key: key,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("key", key);
                setKey(key);
                setRole(data.role);
                setIsAuthenticated(true);
                setUserName(data.cosplayer_fk || null);
                return { success: true, role: data.role };
            } else {
                localStorage.removeItem("key");
                setKey(null);
                setRole(null);
                setIsAuthenticated(false);
                setUserName(null);
                return { success: false, message: "Invalid key" };
            }
        } catch (error) {
            console.error("Login error:", error);
            setKey(null);
            setRole(null);
            setIsAuthenticated(false);
            return { success: false, message: "An error occurred" };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("key");
        setKey(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const storedKey = localStorage.getItem("key");
        if (storedKey) {
            login(storedKey);
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                key,
                role,
                isAuthenticated,
                isLoading,
                login,
                logout,
                userName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
