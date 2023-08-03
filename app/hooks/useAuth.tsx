import { EmailAuthCredential, GoogleAuthProvider, User, applyActionCode, confirmPasswordReset, 
    
    createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail,
     signInWithEmailAndPassword, signInWithPopup, signOut,
    
     updateEmail,
     linkWithCredential,
     reauthenticateWithCredential,
     AuthCredential,
     getAuth,
     EmailAuthProvider,
     verifyBeforeUpdateEmail,

     verifyPasswordResetCode,
         
    
    } from "firebase/auth"
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { auth } from "../firebase"
import { useRouter } from "next/router"
import useMounted from "./useMounted"
import { FirebaseError } from "firebase/app"
import firebase from 'firebase/app';

interface InterfaceAuth { 
    user: User | null, 
    // signUp: (email: string, password: string, firstName: string | null, lastName: string | null) => Promise<void>,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    
    // Change Email 
    changeEmail: (user: User, newEmail: string, password: string) => Promise<void>,
    emailChangeConfirmation: boolean,

    // Password Reset 
    passwordReset: (email: string) => Promise<void>,
    passwordResetEmailSend: boolean,

    // Confirm Password Change
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

    changeEmail: async () => {},
    emailChangeConfirmation: false,

    
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

    const [emailChangeConfirmation, setEmailChangeConfirmation] = useState(false)

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
            // .finally(() => setpasswordResetEmailSend(false))

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
            // .finally(() =>  mounted.current && setpasswordResetSuccess(false))
    }   

    const changeEmail = async (user: User, newEmail: string, password: string) => { 
        if (!user && !newEmail) return

        return await reauthenticateUser(password)
            .then(async () => {
                // await verifyBeforeUpdateEmail(user, newEmail)
                await updateEmail(user, newEmail)
                    .then(() => {
                        setEmailChangeConfirmation(true)
                        console.log("EMAIL CHANGED SUCCESSFULLYT")
                    })
                    .catch((e) => { 
                        alert(e.message)
                        setError(e.code)
                        console.log("Missing Oobcode")
                    })
                    // .finally(() =>  mounted.current && setEmailChangeConfirmation(false))
            }).catch((e) => { 
                console.log(e.code)
                setError(e.code.toString())
            })
    }


    const reauthenticateUser = async (password: string) => { 
        console.log("authenticating user ")
        setLoading(true)
        const user = getAuth().currentUser
        if (!user || !user.email) return
        
        const credential = EmailAuthProvider.credential(user.email, password)
        reauthenticateWithCredential(user, credential)  
            .then((resp) => {
                const user = resp.user
                setUser(user)
                setLoading(false)
            })
            .catch((e) => { 
                console.log(e.code)
                setError(e.code.toString())
            })
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
         passwordResetEmailSend, 
         emailChangeConfirmation,
         changeEmail
    }), [user, loading, passwordResetSuccess, passwordResetEmailSend, error, emailChangeConfirmation])


    return <AuthContext.Provider value={memo}>{
            !startLoading && children
            }</AuthContext.Provider>
}

export default function useAuth() { 
    return useContext(AuthContext)
}