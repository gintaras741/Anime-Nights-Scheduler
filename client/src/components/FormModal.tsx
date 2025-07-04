import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";

const cosplayerSchema = z.object({
    stagename: z.string().min(1, "Stagename is required"),
    cosplayTime: z.string().min(1, "Cosplay time is required"),
    character: z.string().min(1, "Character is required"),
    comment: z.string().optional(),
    prejudge: z.boolean(),
    prejudgeTime: z.string().optional(),
    cosplayAudio: z.string().optional(),
    cosplayVideo: z.string().optional(),
    key: z.string().min(1, "Key is required"),
});
export type Cosplayer = z.infer<typeof cosplayerSchema>;

const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
};

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    cosplayerToEdit?: Cosplayer | null;
    onSubmit: (data: Cosplayer) => void;
}

export default function FormModal({
    isOpen,
    onClose,
    cosplayerToEdit,
    onSubmit,
}: FormModalProps) {
    const form = useForm<Cosplayer>({
        resolver: zodResolver(cosplayerSchema),
        defaultValues: {
            stagename: "",
            cosplayTime: "",
            character: "",
            comment: "",
            prejudge: false,
            prejudgeTime: "",
            cosplayAudio: "",
            cosplayVideo: "",
            key: "",
        },
    });

    const checkKeyMutation = useMutation({
        mutationFn: async (key: string) => {
            const response = await fetch(
                "http://localhost:3000/api/isvalidkey",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        key: localStorage.getItem("key") || "",
                    },
                    body: JSON.stringify({ key }),
                }
            );
            if (!response.ok) {
                return false;
            }
            return true;
        },
        onSuccess: (validKey, generatedKey) => {
            if (!validKey) {
                handleGenerateKey();
            } else {
                form.setValue("key", generatedKey);
            }
        },
    });

    const handleGenerateKey = () => {
        const generatedKey = Math.random().toString(36).substring(2, 15);
        checkKeyMutation.mutate(generatedKey);
    };

    useEffect(() => {
        if (cosplayerToEdit) {
            form.reset({
                ...cosplayerToEdit,
                cosplayTime: formatTime(cosplayerToEdit.cosplayTime),
                prejudgeTime: cosplayerToEdit.prejudgeTime
                    ? formatTime(cosplayerToEdit.prejudgeTime)
                    : "",
                comment: cosplayerToEdit.comment || undefined,
                cosplayAudio: cosplayerToEdit.cosplayAudio || undefined,
                cosplayVideo: cosplayerToEdit.cosplayVideo || undefined,
            });
        } else {
            form.reset({
                stagename: "",
                cosplayTime: "",
                character: "",
                comment: undefined,
                prejudge: false,
                prejudgeTime: "",
                cosplayAudio: undefined,
                cosplayVideo: undefined,
                key: "",
            });
        }
    }, [cosplayerToEdit, isOpen, form.reset]);

    const handleSubmit = (data: Cosplayer) => {
        const DUMMY_DATE = "2004-10-23T";

        const submittedData = {
            ...data,
            cosplayTime: new Date(
                `${DUMMY_DATE}${data.cosplayTime}:00`
            ).toISOString(),
            prejudgeTime: data.prejudgeTime
                ? new Date(`${DUMMY_DATE}${data.prejudgeTime}:00`).toISOString()
                : undefined,
        };

        onSubmit(submittedData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {cosplayerToEdit
                            ? "Edit Cosplayer"
                            : "Add New Cosplayer"}
                    </DialogTitle>
                    <DialogDescription>
                        {cosplayerToEdit
                            ? "Make changes to the cosplayer entry here."
                            : "Add a new cosplayer entry."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="grid gap-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="stagename"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>StageName</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cosplayTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cosplay Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="character"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Character</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="prejudge"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Prejudge
                                        </FormLabel>
                                        <FormDescription>
                                            Does this cosplayer have a prejudge
                                            time?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("prejudge") && (
                            <FormField
                                control={form.control}
                                name="prejudgeTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prejudge Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cosplayVideo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cosplay video</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://drive.google.com/file/d/id/preview"
                                            {...field}
                                        ></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cosplayAudio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cosplay audio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://drive.google.com/file/d/id/preview"
                                            {...field}
                                        ></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <div className="flex">
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <Button
                                            className="ml-5"
                                            type="button"
                                            onClick={handleGenerateKey}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            {cosplayerToEdit ? "Save Changes" : "Add Cosplayer"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
