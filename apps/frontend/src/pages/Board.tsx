import { getBoard } from '@/api/board';
import Section from '@/components/board/Section';
import { CreateIssue } from '@/components/board/CreateIssue';
import NavBar from '@/components/dashboard/NavBar';
import type { TBoard, TOrg, TSection } from 'db/types';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const Board = (props: Props) => {
    const { boardId } = useParams();
    const [users, setUsers] = useState<{ id: string }[]>([])
    const [data, setData] = useState<{ board: TBoard & { sections: TSection[] } & { org: TOrg } } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!boardId) return;
        setIsLoading(true)
        getBoard(boardId)?.then((val) => {
            setData(val)
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3002");
        ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if (data.type === "join") {
                setUsers(u => [...u, { id: data.userId }])
            }
            else if (data.type === "initial_state") {
                setUsers(data.users)

            }
            else if (data.type === "leave") {
                setUsers(prev => prev.filter(u => u.id !== data.userId))

            }

        }
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                boardId
            }))
        }
        return () => {
            ws.close()
        }
    }, [])

    if (!boardId) return "BoardID missing"

    if (isLoading) {
        return <div className='flex items-center justify-center w-full min-h-screen'>
            <Loader className='animate-spin' />
        </div>
    }
    if (!data?.board) {
        return <div className='flex items-center justify-center w-full min-h-screen'>
            <p className='text-3xl'>No Data</p>
        </div>
    }

    return (
        <div className='flex items-center flex-col justify-start h-full w-full'>
            <p>Currently active Users: {JSON.stringify(users)}</p>
            <div>You are on Board: {data.board?.title}</div>
            <CreateIssue sections={data.board.sections} boardId={boardId} />
            <div className='w-full overflow-auto grid grid-cols-3'>
                {
                    data?.board?.sections?.map((section) => {
                        return <Section key={section?.id} sectionId={section.id} title={section.title} />
                    })
                }
            </div>
        </div>
    )
}

export default Board