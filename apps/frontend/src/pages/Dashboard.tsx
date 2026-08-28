import Boards from "@/components/dashboard/Boards";
import { CreateOrgDialog } from "@/components/dashboard/CreateOrgDialog";
import NavBar from "@/components/dashboard/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppState } from "@/provider/AppState";
import { Plus, PlusCircle, Pointer } from "lucide-react";

export default function Dashboard() {
    const { getOrg } = useAppState()
    const org = getOrg()

    return (
        <main className="flex flex-col relative items-center justify-start w-screen h-full min-h-screen">
            <NavBar />


            {/* //TODO: Create an org card if no org and default select first org  */}
            {org?.id ? <Boards orgId={org?.id} /> : <div className="flex items-center justify-center w-full min-h-[90vh]">
                <Card>
                    <CardContent className="flex aspect-square flex-col gap-1 items-center h-min justify-center text-center">
                        <Pointer size={45} strokeWidth={1} />
                        <p className="text-xl font-semibold">
                            Select an organization
                        </p>
                    </CardContent>
                </Card>
            </div>}

        </main>
    );
}