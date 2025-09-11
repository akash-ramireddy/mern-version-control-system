import React , { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children})=>{
    const [ currentUser, setCurrentUser ] = useState(null);
    useEffect(()=>{
        const user = localStorage.getItem('userId');
        if(user){
            setCurrentUser(user);
        }
    },[]);

    const value = {
        currentUser,setCurrentUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
