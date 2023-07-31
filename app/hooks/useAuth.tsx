import { GoogleAuthProvider, User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { auth } from "../firebase"
import { useRouter } from "next/router"

interface InterfaceAuth { 
    user: User | null, 
    // signUp: (email: string, password: string, firstName: string | null, lastName: string | null) => Promise<void>,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    googleSignin: () => Promise<void>,
    error: string | null,
    loading: boolean   
}

const AuthContext = createContext<InterfaceAuth>({
    user: null, 
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
    googleSignin: async () => {},
    error: null, 
    loading: false
})

interface Props { 
    children: React.ReactNode
}


export const AuthProvider = ({children}: Props) => {

    const [startLoading, setstartLoading] = useState(false)

    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState<User | null>(null)

    const [error, setError] = useState<string | null>(null)

    const router = useRouter()  

    /*
        Update the user based on the credentials
    */
    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) { 
            setLoading(false)
            setUser(user)
        } else { 
            setUser(null)
            setLoading(true)
            router.push('/signin')
        }
        setstartLoading(false)
    }), [auth])

    const signUp = async (email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password) 
            .then((credential) => { 
                // Cache the user 
                setUser(credential.user)
                // Go back to the homepage 
                router.push('/')
                // Reset state
                setLoading(false)
            })
            .catch((e) => { 
                // alert(e.message)
                setError(e)
            })
            .finally(() => setLoading(false))
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        await signInWithEmailAndPassword(auth, email, password) 
            .then((credentials) => { 
                setUser(credentials.user)
                router.push('/')
                setLoading(false)
            })
            .catch((e) => { 
                // alert(e.message)
                setError(e)
            })
            .finally(() => setLoading(false))
    }


    const logOut = async () => { 
        setLoading(true)
        await signOut(auth)
            .then(() => { 
                setUser(null)
                // router.push('/')
                // setLoading(false)
            })
            .catch((e) => { 
                // alert(e.message)
                setError(e)
            })
            .finally(() => setLoading(false))
    }

    const googleSignin = async () => { 
        setLoading(true)
        const googleProvider = new GoogleAuthProvider()
        
        signInWithPopup(auth, googleProvider)
          .then((result) => { 
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken;
            const user = result.user

            setUser(user)
            router.push('/')
            setLoading(false)
          })
          .catch((e) => { 
            // alert(e.message)
            setError(e)
        })
        .finally(() => setLoading(false))

    }
    



    const memo = useMemo(() => ({
         user, signUp, signIn, signOut : logOut, loading, error , googleSignin
    }), [user, loading])


    return <AuthContext.Provider value={memo}>{!startLoading && children}</AuthContext.Provider>
}

export default function useAuth() { 
    return useContext(AuthContext)
}