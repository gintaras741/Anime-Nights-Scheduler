import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import { z } from "zod";
import { Button } from "./components/ui/button";
import FormModal from "./components/FormModal";
import { useState } from "react";
import { toast } from "sonner";

const cosplayerSchema = z.object({
    stagename: z.string().min(1, "Stagename is required"),
    cosplayTime: z.string().min(1, "Cosplay time is required"),
    character: z.string().min(1, "Character is required"),
    comment: z.string().optional(),
    prejudge: z.boolean(),
    prejudgeTime: z.string().optional(),
});

export type Cosplayer = z.infer<typeof cosplayerSchema>;

export default function CosplayEditPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cosplayerToEdit, setCosplayerToEdit] = useState<Cosplayer | null>(
        null
    );
    const [originalStagename, setOriginalStagename] = useState<string | null>(
        null
    );

    //GET
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryFn: async () =>
            await fetch("http://localhost:3000/api/cosplayers/all", {
                headers: {
                    key: localStorage.getItem("key") || "",
                },
            }).then((res) => res.json()),
        queryKey: ["cosplayall"],
    });

    //POST
    const addCosplayerMutation = useMutation({
        mutationFn: async (newCosplayer: Cosplayer) => {
            const response = await fetch(
                "http://localhost:3000/api/cosplayers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        key: localStorage.getItem("key") || "",
                    },
                    body: JSON.stringify(newCosplayer),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add cosplayer");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cosplayall"] });
            toast.success("Cosplayer added successfully!");
        },
        onError: (error: any) => {
            toast.error(`Error adding cosplayer: ${error.message}`);
        },
    });

    //PUT
    const updateCosplayerMutation = useMutation({
        mutationFn: async ({
            originalStagename,
            updatedCosplayer,
        }: {
            originalStagename: string;
            updatedCosplayer: Cosplayer;
        }) => {
            if (!originalStagename) {
                throw new Error("Original stagename is required for update");
            }
            const response = await fetch(
                `http://localhost:3000/api/cosplayers/${originalStagename}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        key: localStorage.getItem("key") || "",
                    },
                    body: JSON.stringify(updatedCosplayer),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update cosplayer");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cosplayall"] });
            toast.success("Cosplayer updated successfully!");
        },
        onError: (error: any) => {
            toast.error(`Error updating cosplayer: ${error.message}`);
        },
    });

    //DELETE
    const deleteCosplayerMutation = useMutation({
        mutationFn: async (staename: string) => {
            const response = await fetch(
                `http://localhost:3000/api/cosplayers/${staename}`,
                {
                    method: "DELETE",
                    headers: {
                        key: localStorage.getItem("key") || "",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete cosplayer");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cosplayall"] });
            toast.success("Cosplayer deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(`Error deleting cosplayer: ${error.message}`);
        },
    });

    const handleAddClick = () => {
        setCosplayerToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (cosplayer: Cosplayer) => {
        setCosplayerToEdit(cosplayer);
        setOriginalStagename(cosplayer.stagename);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (stagename: string) => {
        if (window.confirm("Are you sure you want to delete this cosplayer?")) {
            await deleteCosplayerMutation.mutateAsync(stagename);
        }
    };

    const handleSave = (data: Cosplayer) => {
        if (cosplayerToEdit) {
            if (!originalStagename) {
                toast.error(
                    "Failed to update: original cosplayer stagename not found."
                );
                return;
            }
            updateCosplayerMutation.mutate({
                originalStagename: originalStagename,
                updatedCosplayer: data,
            });
        } else {
            addCosplayerMutation.mutate(data);
        }
    };

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
                            <TableHead className="w-36 min-w-0">
                                Character
                            </TableHead>
                            <TableHead className="w-18 min-w-0">
                                Prejudge
                            </TableHead>
                            <TableHead className="w-32 min-w-0">
                                Prejudge Time
                            </TableHead>
                            <TableHead className="w-80 min-w-0">
                                Comment
                            </TableHead>
                            <TableHead className="w-14 min-w-0">Edit</TableHead>
                            <TableHead className="w-18 min-w-0">
                                Delete
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
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
                                            <TableCell>
                                                {cosplayer.character}
                                            </TableCell>
                                            <TableCell>
                                                {cosplayer.prejudge
                                                    ? "true"
                                                    : "false"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {new Date(
                                                    cosplayer.prejudgeTime
                                                ).toLocaleTimeString("lt-LT", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {cosplayer.comment}
                                            </TableCell>
                                            <TableCell className="bg-gray-950 text-center w-10 min-w-0">
                                                <Button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            cosplayer
                                                        )
                                                    }
                                                    className="bg-gray-800 text-white p-2 cursor-pointer"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell className="bg-gray-950 text-center w-10 min-w-0">
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            cosplayer.stagename
                                                        )
                                                    }
                                                    variant="destructive"
                                                    className="bg-gray-800 text-white p-2 cursor-pointer"
                                                >
                                                    Delete
                                                </Button>
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
                <FormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    cosplayerToEdit={cosplayerToEdit}
                    onSubmit={handleSave}
                />
            </div>
            <Button
                className="w-20 bg-gray-800 text-white cursor-pointer mt-4"
                onClick={handleAddClick}
            >
                Add
            </Button>
        </div>
    );
}
