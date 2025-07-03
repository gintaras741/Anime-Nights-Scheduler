import { Card, CardContent } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function AccessDeniedPage() {
    return (
        <div className=" bg-gray-950 text-white flex flex-col">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
                <div className="max-w-md w-full mx-auto">
                    <Card className="bg-gray-900 border-red-500 border-2">
                        <CardContent className="p-8 text-center">
                            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                <ShieldX className="h-10 w-10 text-red-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                Access Denied
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                You don't have the sufficient permissions to
                                access this page.
                            </p>
                            <div className="bg-gray-800 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-400">
                                    If you believe this is an error, please{" "}
                                    <a
                                        href="mailto:gintaras.gaucys1@gmail.com"
                                        className="text-red-500 underline hover:text-red-400"
                                    >
                                        contact me
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
