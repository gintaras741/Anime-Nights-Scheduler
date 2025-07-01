import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
export default function LoginPage() {
    const [input, setInput] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) {
            toast.error("Please enter a key");
            return;
        }

        const result = await login(input.trim());

        if (result.success) {
            toast.success("Login successful");
            navigate(from, { replace: true });
        } else {
            toast.error(result.message || "Login failed");
            setInput("");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-100">
            {" "}
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Enter Key</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="apiKey"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Access key
                            </label>
                            <Input
                                id="apiKey"
                                type="password"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="****************"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
