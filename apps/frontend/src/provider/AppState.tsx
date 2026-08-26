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
    org: TOrg | null
    setOrg: React.Dispatch<React.SetStateAction<AppStateContextType['org']>>
    board: TBoard | null
    setBoard: React.Dispatch<React.SetStateAction<AppStateContextType['board']>>

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
    const [org, setOrg] = useState<AppStateContextType['org']>(null)
    const [board, setBoard] = useState<AppStateContextType["board"]>(null)

    return (
        <AppStateContext.Provider
            value={{
                org,
                setOrg,
                board,
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