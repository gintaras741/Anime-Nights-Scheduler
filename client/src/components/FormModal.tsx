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

const cosplayerSchema = z.object({
    stagename: z.string().min(1, "Stagename is required"),
    cosplayTime: z.string().min(1, "Cosplay time is required"),
    character: z.string().min(1, "Character is required"),
    comment: z.string().optional(),
    prejudge: z.boolean(),
    prejudgeTime: z.string().optional(),
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
        },
    });

    useEffect(() => {
        if (cosplayerToEdit) {
            form.reset({
                ...cosplayerToEdit,
                cosplayTime: formatTime(cosplayerToEdit.cosplayTime),
                prejudgeTime: cosplayerToEdit.prejudgeTime
                    ? formatTime(cosplayerToEdit.prejudgeTime)
                    : "",
                comment: cosplayerToEdit.comment || undefined,
            });
        } else {
            form.reset({
                stagename: "",
                cosplayTime: "",
                character: "",
                comment: undefined,
                prejudge: false,
                prejudgeTime: "",
            });
        }
    }, [cosplayerToEdit, isOpen, form.reset]);

    const handleSubmit = (data: Cosplayer) => {
        const DUMMY_DATE = "2001-09-11T";

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

                        <Button type="submit">
                            {cosplayerToEdit ? "Save Changes" : "Add Cosplayer"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
