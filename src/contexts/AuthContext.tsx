import { useContext, createContext, useState, ReactNode } from "react";

interface AuthContextType {
    logOut: () => Promise<void>;
    user: any;
    logIn: (username: string, password: string) => Promise<{ user: any } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    const logOut = async () => {
        setUser(null);
        localStorage.removeItem('role');
    };

    const logIn = async (username: string, password: string) => {
        const mockUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'staff', password: 'staff123', role: 'staff' },
            { username: 'huy', password: 'huy', role: 'admin' },
        ];
        const user = mockUsers.find(user => user.username === username && user.password === password);
        if (user) {
            setUser(user);
            localStorage.setItem('role', user.role);
            return { user };
        } else {
            throw new Error('Invalid username or password');
        }
    };

    return (
        <AuthContext.Provider value={{ logOut, user, logIn }}>
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