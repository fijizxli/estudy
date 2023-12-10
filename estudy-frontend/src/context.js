import {createContext, useEffect, useState} from "react";

const DataContext =  createContext();

export const DataProvider = ({ children }) => {
    const [AuthModalType, setAuthModalType] = useState("Inactive")
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    return (
        <DataContext.Provider value={{ isLoggedIn, setUser, user,setIsLoggedIn, AuthModalType, setAuthModalType}}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;