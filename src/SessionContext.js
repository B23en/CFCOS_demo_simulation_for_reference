import { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export function useSession() {
    return useContext(SessionContext);
}

export function SessionProvider({ children }){
    const [sessionId, setSessionId] = useState(null);

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId }}>
            {children}
        </SessionContext.Provider>
    )
}