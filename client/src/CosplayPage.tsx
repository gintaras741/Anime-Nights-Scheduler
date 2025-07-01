import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { io } from "socket.io-client";
import { NavLink } from "react-router";

export default function CosplayPage() {
    const [socket, setSocket] = useState<any>(null);
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryFn: async () =>
            await fetch("http://localhost:3000/api/cosplayers", {
                headers: {
                    key: localStorage.getItem("key") || "",
                },
            }).then((res) => res.json()),
        queryKey: ["cosplay"],
    });

    useEffect(() => {
        const socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("Connected to the server");
            setSocket(socket);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from the server");
            setSocket(null);
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        socket.on("cosplayersUpdated", () => {
            queryClient.invalidateQueries({
                queryKey: ["cosplay"],
            });
        });

        return () => {
            socket.disconnect();
            console.log("Socket disconnected");
        };
    }, [queryClient]);

    const handleCosplayerCrossOut = (stagename: string) => {
        socket.emit("cosplayersCrossedOut", stagename);
    };
    const handleCosplayerGlowToggle = (stagename: string) => {
        socket.emit("cosplayersGlowToggle", stagename);
    };
    return (
        <div className="flex flex-col items-left mx-auto">
            <div className="flex justify-center">
                <Table className="mt-10 max-w-240 min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 min-w-0">❌</TableHead>
                            <TableHead className="w-12 min-w-0">🤮</TableHead>
                            <TableHead className="w-12 min-w-0">Nr</TableHead>
                            <TableHead className="w-32 min-w-0">
                                Stagename
                            </TableHead>
                            <TableHead className="w-20 min-w-0">Time</TableHead>
                            <TableHead className="w-36 min-w-0">
                                Character
                            </TableHead>
                            <TableHead className="w-80 min-w-0">
                                Comment
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.cosplayers.map(
                                (cosplayer: any, index: number) => {
                                    const isCrossedOut =
                                        cosplayer.isCrossedOutCosplay;
                                    return (
                                        <TableRow
                                            key={cosplayer.stagename}
                                            className={
                                                isCrossedOut
                                                    ? "line-through text-gray-500"
                                                    : cosplayer.isGlowingCosplay
                                                    ? "animate-pulse-glow-green"
                                                    : ""
                                            }
                                        >
                                            <TableCell className="bg-gray-950 text-center w-10 min-w-0">
                                                <Button
                                                    className="bg-gray-800 text-white p-2 cursor-pointer"
                                                    onClick={() =>
                                                        handleCosplayerCrossOut(
                                                            cosplayer.stagename
                                                        )
                                                    }
                                                >
                                                    ❌
                                                </Button>
                                            </TableCell>
                                            <TableCell className="bg-gray-950 text-center w-10 min-w-0">
                                                <Button
                                                    className="bg-gray-800 text-white p-2 cursor-pointer"
                                                    onClick={() =>
                                                        handleCosplayerGlowToggle(
                                                            cosplayer.stagename
                                                        )
                                                    }
                                                >
                                                    🤮
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell>
                                                {cosplayer.stagename}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {new Date(
                                                    cosplayer.cosplayTime
                                                ).toLocaleTimeString("lt-LT", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {cosplayer.character}
                                            </TableCell>
                                            <TableCell>
                                                {cosplayer.comment}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                        )}
                    </TableBody>
                    {isLoading ? null : (
                        <TableFooter>
                            <TableRow>
                                <TableCell className="text-center">
                                    Total
                                </TableCell>
                                <TableCell className="text-center">
                                    {data.cosplayers.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
            <NavLink className="w-20 mt-4" to="/cosplay/edit">
                <Button className="w-20 bg-gray-800 text-white cursor-pointer">
                    Edit
                </Button>
            </NavLink>
        </div>
    );
}
