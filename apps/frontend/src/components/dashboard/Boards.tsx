import { getBoards } from "@/api/board"
import type { TBoard } from "db/types"
import { useEffect, useState } from "react"
import { CreateBoard } from "./CreateBoard"
import { Card } from "../ui/card"
import { Link } from "react-router-dom"

type Props = {
    orgId: string
}

const Boards = ({ orgId }: Props) => {
    const [boards, setBoards] = useState<TBoard[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(true)
        getBoards(orgId).then(({ boards }: { boards: TBoard[] }) => {
            setBoards(boards)
        }).catch(err => console.error(err)).finally(() => {
            setIsLoading(false)
        })
    }, [orgId])


    return (
        <div className="grid grid-cols-4 w-full gap-4 p-4">
            {
                isLoading ?
                    <>
                        {Array.from({ length: 12 }).map((v, i) => {
                            return <div className="w-full h-36 rounded-md bg-slate-700/10" />
                        })}
                    </>
                    :
                    <>
                        {boards?.map((board) => {
                            return <Link key={board.id} to={`/board/${board.id}`}>
                                <BoardCard data={board} />
                            </Link>
                        })}
                        <CreateBoard setBoards={setBoards} />
                    </>
            }

        </div>
    )
}

export default Boards


export function BoardCard({ data }: { data: TBoard }) {
    return <Card className="h-36 flex items-center justify-center" >{data.title}</Card>
}