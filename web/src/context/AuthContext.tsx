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
    totalSavedCount: number;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [totalSavedCount, setTotalSavedCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setUser(user);

            if (user) {
                // Check subscription status from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setIsPro(data?.isPro || false);
                    setTotalSavedCount(data?.totalSavedCount || 0);

                    // Initialize totalSavedCount for existing users if needed
                    if (data?.totalSavedCount === undefined) {
                        const { collection, query, where, getDocs } = await import('firebase/firestore');
                        const itemsQuery = query(collection(db, 'savedItems'), where('userId', '==', user.uid));
                        const itemsSnapshot = await getDocs(itemsQuery);
                        const currentCount = itemsSnapshot.size;

                        await setDoc(doc(db, 'users', user.uid), {
                            ...data,
                            totalSavedCount: currentCount
                        }, { merge: true });

                        setTotalSavedCount(currentCount);
                        console.log('Initialized totalSavedCount for existing user:', currentCount);
                    }
                } else {
                    // Create user document if it doesn't exist
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        displayName: user.displayName,
                        isPro: false,
                        totalSavedCount: 0,
                        createdAt: new Date(),
                    });
                    setIsPro(false);
                    setTotalSavedCount(0);
                }
            } else {
                setIsPro(false);
                setTotalSavedCount(0);
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

    const refreshUserData = async () => {
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setIsPro(data?.isPro || false);
                setTotalSavedCount(data?.totalSavedCount || 0);
                console.log('✅ User data refreshed - totalSavedCount:', data?.totalSavedCount);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isPro, totalSavedCount, loginWithGoogle, loginWithEmail, signupWithEmail, logout, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
