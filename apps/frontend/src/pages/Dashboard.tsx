import NavBar from "@/components/dashboard/NavBar";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {


    return (
        <main className="flex relative items-start justify-center w-screen h-full min-h-screen">
            <NavBar />

        </main>
    );
}