import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";

export default function UserCosplayPage() {
    const { data, isLoading } = useQuery({
        queryFn: async () =>
            await fetch("http://localhost:3000/api/cosplayers/user", {
                headers: {
                    key: localStorage.getItem("key") || "",
                },
            }).then((res) => res.json()),
        queryKey: ["cosplayUser"],
    });
    return (
        <div className="flex flex-col items-left mx-auto">
            <div className="flex justify-center">
                <Table className="mt-10 max-w-240 min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 min-w-0">Nr</TableHead>
                            <TableHead className="w-32 min-w-0">
                                Stagename
                            </TableHead>
                            <TableHead className="w-20 min-w-0">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.cosplayers.map(
                                (cosplayer: any, index: number) => {
                                    return (
                                        <TableRow key={cosplayer.stagename}>
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
                                        </TableRow>
                                    );
                                }
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
