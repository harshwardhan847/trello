import { getSectionIssues } from "@/api/issue"
import { useAppState } from "@/provider/AppState"
import type { TIssue } from "db/types"
import { useEffect, useState } from "react"

type Props = { sectionId: string, title: string }

const Section = ({ sectionId, title }: Props) => {
    const [issues, setIssues] = useState<TIssue[] | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSectionIssues(sectionId).then((data) => {
            setIsLoading(true)
            setIssues(data.issues)
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [sectionId])

    return (
        <div className="w-full border rounded-md flex items-center flex-col justify-start">
            <div className="p-4 bg-blue-400 w-full flex items-center justify-center">{title}</div>
            <div className="flex flex-col items-center justify-start gap-4 w-full p-1">

                {isLoading ? "Loading..." :
                    issues?.map((issue) => {
                        return <div className="p-2 border shadow w-full">
                            <p className="truncate text-xl font-semibold">{issue.title}</p>
                            <p className="truncate">{issue.description}</p>
                        </div>
                    })}
            </div>

        </div>
    )
}

export default Section