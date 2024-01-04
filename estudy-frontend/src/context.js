import {createContext, useContext, useEffect, useState} from "react";

const DataContext =  createContext();

export const DataProvider = ({ children }) => {
    const [AuthModalType, setAuthModalType] = useState("Inactive")
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState("")
    const [userId, setUserId] = useState(0)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    return (
        <DataContext.Provider value={{ isLoggedIn, setUser, user, setUserName, userName, userId, setUserId, setIsLoggedIn, AuthModalType, setAuthModalType}}>
            {children}
        </DataContext.Provider>
    )
};

export const useUser = () => {
    return useContext(DataContext);
};

export default DataContext;