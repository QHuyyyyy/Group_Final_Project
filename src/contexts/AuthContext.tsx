import { useContext, createContext, useEffect, useState, ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthContextType {
    googleSignIn: () => Promise<{ user: any; token: string }>;
    logOut: () => Promise<void>;
    user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        return {
            user: result.user,
            token: token
        };
    };

    const logOut = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User', currentUser);
        });
        return () => {
            unSubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UserAuth must be used within an AuthContextProvider");
    }
    return context;
};