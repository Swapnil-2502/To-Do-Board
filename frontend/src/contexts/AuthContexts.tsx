import { createContext, useEffect, useState } from "react";
import type { User } from "../types";

export interface AuthContextType{
    user: User | null,
    token: string | null,
    login: (user: User, token: string) => void,
    logout: () => void,
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token")
        if ( savedUser &&
        savedUser !== "undefined" &&
        savedToken &&
        savedToken !== "undefined") {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false)
    },[])

    const login = (user: User, token: string) => {
        setUser(user)
        setToken(token)
        localStorage.setItem('user',JSON.stringify(user))
        localStorage.setItem('token',token)
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return(
        <>
            <AuthContext.Provider value={{ user, token, login, logout, loading }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthContext;