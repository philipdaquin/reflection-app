import { GoogleAuthProvider, User, applyActionCode, confirmPasswordReset, 
    
    createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { auth } from "../firebase"
import { useRouter } from "next/router"
import useMounted from "./useMounted"

interface InterfaceAuth { 
    user: User | null, 
    // signUp: (email: string, password: string, firstName: string | null, lastName: string | null) => Promise<void>,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    
    passwordReset: (email: string) => Promise<void>,
    passwordResetEmailSend: boolean,


    passwordResetSuccess: boolean, 
    confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>,
    googleSignin: () => Promise<void>,
    error: string | null,
    loading: boolean   
}

const AuthContext = createContext<InterfaceAuth>({
    user: null, 
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
    
    passwordReset: async () => {},
    passwordResetEmailSend: false,

    confirmPasswordReset: async () => {},
    passwordResetSuccess: false,

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

    const [passwordResetSuccess, setpasswordResetSuccess] = useState(false)
    const [passwordResetEmailSend, setpasswordResetEmailSend] = useState(false)


    const mounted = useMounted()

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
            // router.push('/signin')
        }
        setstartLoading(false)
    }), [auth])

    const signUp = async (email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password) 
            .then(async (credential) => { 
                // Cache the user 
                setUser(credential.user)
                
                // Send verification 
                // await sendEmailVerification(credential.user, )

                // new users will need to verify their accounts
                router.push('/')
                // Reset state
                setLoading(false)
            })
            .catch((e) => { 
                // alert(e.message)
                setError(e.code)
            })
            .finally(() => mounted.current && setLoading(false))
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
                setError(e.code)
            })
            .finally(() =>  mounted.current && setLoading(false))
    }


    const logOut = async () => { 
        setLoading(true)
        await signOut(auth)
            .then(() => { 
                setUser(null)
                // router.push('/')
                setLoading(false)
            })
            .catch((e) => { 
                // alert(e.message)
                setError(e.code)
            })
            .finally(() =>  mounted.current && setLoading(false))
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
            setError(e.code)

        })
        .finally(() =>  mounted.current && setLoading(false))

    }
    

    const passwordReset = async (email: string) => {
        return await sendPasswordResetEmail(auth, email)
            .then(() => setpasswordResetEmailSend(true))
            .catch((e) => { 
                console.log(e.code)
                // console.error(e.message)
                // alert(e.message)
                setError(e.code.toString())

                if (e.code === 'auth/invalid-action-code') { 
                    setError('Something is wrong. Try again later!')
                }

            })
            .finally(() =>  mounted.current && setpasswordResetEmailSend(false))

    }

    const sendPasswordReset = async (oob: string, newPassword: string) => { 
        if (!oob && !newPassword) return;
        await confirmPasswordReset(auth, oob, newPassword)
            .then(() => setpasswordResetSuccess(true))
            .catch((e) => { 
                // alert(e.message)
                setError(e.code)
                console.log("Missing Oobcode")
            })
            .finally(() =>  mounted.current && setpasswordResetSuccess(false))
    }



    const memo = useMemo(() => ({
         user, 
         signUp, 
         signIn, 
         signOut : logOut, 
         loading, 
         error, 
         googleSignin, 
         passwordReset, 
         confirmPasswordReset: sendPasswordReset,
         passwordResetSuccess,
         passwordResetEmailSend
    }), [user, loading, passwordResetSuccess, passwordResetEmailSend, error])


    return <AuthContext.Provider value={memo}>{
            !startLoading && children
            }</AuthContext.Provider>
}

export default function useAuth() { 
    return useContext(AuthContext)
}