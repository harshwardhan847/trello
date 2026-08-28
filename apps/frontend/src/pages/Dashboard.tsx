import Boards from "@/components/dashboard/Boards";
import NavBar from "@/components/dashboard/NavBar";
import { useAppState } from "@/provider/AppState";

export default function Dashboard() {
    const { getOrg } = useAppState()
    const org = getOrg()

    return (
        <main className="flex flex-col relative items-center justify-start w-screen h-full min-h-screen">
            <NavBar />
            {/* //TODO: Create an org card if no org and default select first org  */}
            {org?.id ? <Boards orgId={org?.id} /> : "select an org or create one"}

        </main>
    );
}