import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,

    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

import { boardSchema, type CreateBoardInput } from "schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import type { TBoard } from "db/types"
import { createBoard } from "@/api/board"
import { useAppState } from "@/provider/AppState"

export function CreateBoard({
    setBoards
}: {
    setBoards: React.Dispatch<React.SetStateAction<TBoard[]>>
}) {
    const [open, setOpen] = useState(false)
    const { org } = useAppState()
    const form = useForm<CreateBoardInput>({
        resolver: zodResolver(
            boardSchema,
        ),
        defaultValues: {
            title: "",
            orgId: org?.id,
        },
    });

    async function onSubmit(
        data: { title: string },
    ) {
        try {
            if (!org?.id) {
                console.log("Org Id Missing")
                return;
            }
            const response =
                await createBoard({ title: data.title, orgId: org.id });
            setBoards(prev => [...prev, {
                ...response.board
            }])
            console.log(
                "Board created:",
                response,
            );

            form.reset();

            setOpen(false);
        } catch (error: any) {
            console.error(error);

            // Server-side error
            form.setError("root", {
                message:
                    error.response?.data?.message ??
                    "Failed to create organization",
            });
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-full">
                    <Plus />
                    Create Board
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create Board</DialogTitle>
                    </DialogHeader>
                    <FieldGroup className=" mt-4">
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...form.register("title")} />
                            {form.formState.errors.title && (
                                <FieldError>
                                    {
                                        form.formState.errors.title
                                            .message
                                    }
                                </FieldError>
                            )}
                        </Field>
                        {/* Server error */}
                        {form.formState.errors.root && (
                            <FieldError>
                                {
                                    form.formState.errors.root
                                        .message
                                }
                            </FieldError>
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={
                                form.formState.isSubmitting
                            }
                        >
                            {form.formState.isSubmitting
                                ? "Creating..."
                                : "Create Board"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
