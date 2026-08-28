import type { TBoard, TOrg } from "db/types";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";




type AppStateContextType = {
    getOrg: () => TOrg | null
    setOrg: (org: TOrg) => void
    getBoard: () => TBoard | null
    setBoard: (board: TBoard) => void

};

const AppStateContext =
    createContext<AppStateContextType | null>(
        null,
    );

export function AppStateProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [org, setOrgLocal] = useState<TOrg | null>(null)
    const [board, setBoardLocal] = useState<TBoard | null>(null)

    const orgLocalStorage = localStorage.getItem("org") ?? null;
    const boardLocalStorage = localStorage.getItem("board") ?? null;

    const setBoard = (board: TBoard) => {
        localStorage.setItem("board", JSON.stringify(board));
        setBoardLocal(board)
    }
    const setOrg = (org: TOrg) => {
        localStorage.setItem("org", JSON.stringify(org));
        setOrgLocal(org)
    }
    const getOrg = () => {
        return orgLocalStorage ? JSON.parse(orgLocalStorage) as TOrg : org
    }
    const getBoard = () => {
        return boardLocalStorage ? JSON.parse(boardLocalStorage) as TBoard : board
    }





    return (
        <AppStateContext.Provider
            value={{
                getOrg,
                setOrg,
                getBoard,
                setBoard
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
}


export function useAppState() {
    const context =
        useContext(AppStateContext);

    if (!context) {
        throw new Error(
            "useAppState must be used inside AppStateProvider",
        );
    }

    return context;
}