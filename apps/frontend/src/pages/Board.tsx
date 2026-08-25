import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const Board = (props: Props) => {
    const { boardId } = useParams();
    const [users, setUsers] = useState<{ id: string }[]>([])

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

    return (
        <div>
            <div>You are on Board: {boardId}</div>
            <p>Currently active Users: {JSON.stringify(users)}</p>
        </div>
    )
}

export default Board