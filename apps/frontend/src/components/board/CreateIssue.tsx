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

import { boardSchema, issueSchema, type CreateBoardInput, type CreateIssueInput } from "schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import type { TBoard, TSection } from "db/types"
import { createBoard } from "@/api/board"
import { useAppState } from "@/provider/AppState"
import { createIssue } from "@/api/issue"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { SelectValue } from "@radix-ui/react-select"

export function CreateIssue({
    sections,
    boardId
}: {
    sections: TSection[],
    boardId: string,

}) {
    const [open, setOpen] = useState(false)
    const { getOrg } = useAppState()
    const org = getOrg();
    const form = useForm<CreateIssueInput>({
        resolver: zodResolver(
            issueSchema,
        ),
        defaultValues: {
            boardId,
            sectionId: sections[0] ? sections[0]?.id : undefined,
            order: 0
        },
    });

    async function onSubmit(
        data: CreateIssueInput,
    ) {
        console.log("submit issue")
        try {
            if (!org?.id) {
                console.log("Org Id Missing")
                return;
            }
            const response =
                await createIssue({ title: data.title, description: data?.description, sectionId: data.sectionId, boardId, order: 0 });

            console.log(
                "Issue created:",
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
                    "Failed to create Issue",
            });
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="">
                    <Plus />
                    Create Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("VALIDATION ERRORS:", errors)
                })}>
                    <DialogHeader>
                        <DialogTitle>Create Issue</DialogTitle>
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
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" {...form.register("description")} />
                            {form.formState.errors.description && (
                                <FieldError>
                                    {
                                        form.formState.errors.description
                                            .message
                                    }
                                </FieldError>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="section">Section</Label>
                            <Select name="section" defaultValue={sections[0]?.id ?? undefined} onValueChange={(value) => {
                                form.setValue("sectionId", value)
                            }}>
                                <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                <SelectContent>
                                    {sections.map((section) => <SelectItem key={section.id} value={section.id}>{section.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.sectionId && (
                                <FieldError>
                                    {
                                        form.formState.errors.sectionId
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
                                : "Create Issue"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
