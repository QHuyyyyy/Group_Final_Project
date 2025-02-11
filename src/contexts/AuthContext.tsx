import { useContext, createContext, useEffect, useState, ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthContextType {
    googleSignIn: () => Promise<{ user: any }>;
    logOut: () => Promise<void>;
    user: any;
    logIn: (username: string, password: string) => Promise<{ user: any } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return {
            user: result.user,
        };
    };

    const logOut = async () => {
        await signOut(auth);
        localStorage.removeItem('role')
    };

    const logIn = async (username: string, password: string) => {
        // Kiểm tra thông tin đăng nhập
        const mockUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'staff', password: 'staff123', role: 'staff' },
            { username: 'huy', password: 'huy', role: 'admin' },
          ];
        const user = mockUsers.find(user => user.username === username && user.password === password);
        if (user) {
            setUser(user); // Lưu thông tin người dùng vào trạng thái
            return { user };
        } else {
            throw new Error('Invalid username or password');
        }
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
        <AuthContext.Provider value={{ googleSignIn, logOut, user, logIn }}>
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