import { getUserOrgs } from "@/api/org"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import type { TOrg } from "db/types"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { CreateOrgDialog } from "./CreateOrgDialog"

type Props = {}

const OrgSelector = (props: Props) => {
    const [orgs, setOrgs] = useState<{ org: TOrg }[]>([])
    useEffect(() => {
        getUserOrgs().then((data) => {
            setOrgs(data)
        }).catch((err) => {
            console.error(err)
        })
    }, [])
    console.log(orgs)

    return (
        <Select>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select an Organization" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Organizations</SelectLabel>
                    {
                        orgs?.map(({ org }) => {
                            return <SelectItem key={org?.id} value={org.id}>{org.name}</SelectItem>
                        })
                    }



                    <CreateOrgDialog setOrgs={setOrgs} />
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default OrgSelector