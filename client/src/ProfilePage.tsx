import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MessageSquare, Upload, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

export default function ProfilePage() {
    const { data, isLoading } = useQuery({
        queryFn: async () =>
            await fetch("http://localhost:3000/api/profile", {
                headers: {
                    key: localStorage.getItem("key") || "",
                },
            }).then((res) => res.json()),
        queryKey: ["profile"],
    });
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* User Info Card */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                                    <User className="h-5 w-5 text-red-500" />
                                </div>
                                {data.cosplayer.stagename}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Character
                                </p>
                                <p className="text-white font-medium text-lg">
                                    {data.cosplayer.character}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule Cards */}
                    <div className="space-y-4">
                        {/* Cosplay Time */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-8">
                                <div className="flex items-center space-x-6">
                                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                                        <Calendar className="h-8 w-8 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-medium text-white mb-3">
                                            Cosplay Time
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="border-red-500 text-red-500 text-lg px-4 py-2"
                                        >
                                            {new Date(
                                                data.cosplayer.cosplayTime
                                            ).toLocaleTimeString("lt-LT", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prejudge Time */}
                        {data.cosplayer.prejudge && (
                            <Card className="bg-gray-900 border-gray-800">
                                <CardContent className="p-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                                            <Clock className="h-8 w-8 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-medium text-white mb-3">
                                                Prejudge Time
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="border-red-500 text-red-500 text-lg px-4 py-2"
                                            >
                                                {new Date(
                                                    data.cosplayer.prejudgeTime
                                                ).toLocaleTimeString("lt-LT", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Comments Card */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <MessageSquare className="h-5 w-5 text-red-500" />
                                Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 leading-relaxed">
                                {data.cosplayer.comment}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Upload className="h-5 w-5 text-red-500" />
                                Contest Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <iframe
                                src={data.cosplayer.cosplayAudio}
                                width="640"
                                height="120"
                                allow="autoplay"
                            ></iframe>
                            {data.cosplayer.cosplayVideo && (
                                <iframe
                                    src={data.cosplayer.cosplayVideo}
                                    width="640"
                                    height="480"
                                    allow="autoplay"
                                ></iframe>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-yellow-600">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-yellow-500 mb-3">
                                    Important Notice
                                </h4>
                                <p className="text-m text-gray-300 leading-relaxed">
                                    If any displayed information is incorrect,
                                    pleace contact us at{" "}
                                    <a
                                        href="mailto:animenights@infosa.lt"
                                        className="text-red-500 underline hover:text-red-400"
                                    >
                                        animenights@infosa.lt
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
