"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isPro: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setUser(user);

            if (user) {
                // Check subscription status from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setIsPro(userDoc.data()?.isPro || false);
                } else {
                    // Create user document if it doesn't exist
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        displayName: user.displayName,
                        isPro: false,
                        createdAt: new Date(),
                    });
                    setIsPro(false);
                }
            } else {
                setIsPro(false);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error) {
            console.error("Email login failed", error);
            throw error;
        }
    };

    const signupWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
            }
            router.push("/dashboard");
        } catch (error) {
            console.error("Email signup failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isPro, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
