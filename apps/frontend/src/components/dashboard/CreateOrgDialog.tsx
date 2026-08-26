import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { orgSchema, type CreateOrganizationInput } from "schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrg } from "@/api/org"
import { useState } from "react"
import type { TOrg } from "db/types"

export function CreateOrgDialog({
    setOrgs
}: {
    setOrgs: React.Dispatch<React.SetStateAction<{
        org: TOrg;
    }[]>>
}) {
    const [open, setOpen] = useState(false)
    const form = useForm<CreateOrganizationInput>({
        resolver: zodResolver(
            orgSchema,
        ),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(
        data: CreateOrganizationInput,
    ) {
        try {
            const response =
                await createOrg(data);
            setOrgs(prev => [...prev, {
                org: response.org
            }])
            console.log(
                "Organization created:",
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
                <Button variant="outline">
                    <Plus />
                    Create Organization
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create Organization</DialogTitle>
                        {/* <DialogDescription>
                            Create a new Organization
                        </DialogDescription> */}
                    </DialogHeader>
                    <FieldGroup className=" mt-4">
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register("name")} />
                            {form.formState.errors.name && (
                                <FieldError>
                                    {
                                        form.formState.errors.name
                                            .message
                                    }
                                </FieldError>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="description">description</Label>
                            <Textarea id="description" {...form.register("description")} />
                            {form.formState.errors.description && (
                                <FieldError>
                                    {
                                        form.formState.errors.description
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
                                : "Create Organization"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
