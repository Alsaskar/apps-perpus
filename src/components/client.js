import { createContext, useContext, useMemo, useState } from "react";
import axios from 'axios'
import { url_api } from "../config";

export const ClientContext = createContext(null)

const getAccountRole = (role) => {
    if(role === 'admin'){
        return 'admin'
    }else if(role === 'anggota'){
        return 'anggota'
    }
}

const detailAccount = async (account, id_user) => {
    if(getAccountRole('anggota') === 'anggota'){
        await axios.get(url_api + '/anggota/' + id_user, {
            headers: {"Authorization": `Bearer ${sessionStorage.getItem('token')}`}
        }).then((res) => {
            account.anggota = res.data
        })
    }

    return account
}

export const ClientProvider = ({children}) => {
    const [roleAccount, setRoleAccount] = useState(null)
    const [account, setAccount] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const role = useMemo(() => {
        if(roleAccount === null) return null
        return getAccountRole(roleAccount)
    }, [roleAccount])

    const authenticate = async () => {
        await axios.get(url_api + '/auth/logged-in', {
            headers: {"Authorization": `Bearer ${sessionStorage.getItem('token')}`}
        }).then((res) => {
            if(res.data.role === 'anggota'){ // jika anggota yang login
                // ambil data anggota
                const account = detailAccount(res.data, res.data.id)
                setAccount(account)
            }else{ // jika admin yang login
                setAccount(res.data)
            }
            
            setRoleAccount(res.data.role)
            setIsAuthenticated(true)

            // jika token sudah habis waktu
            // token pada browser akan terhapus
            if(res.data.loggedIn === false){
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('role')
            }

            return res.data;
        })
    }

    const logout = async () => {
        window.location = "/"
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('role')
        setIsAuthenticated(false)
    }

    const client = useMemo(() => {
        return{
            account,
            role,
            authenticate,
            logout,
            isAuthenticated
        }
    }, [account, role, isAuthenticated])
    

    return(
        <ClientContext.Provider value={client}>
            {children}
        </ClientContext.Provider>
    )
}

export const useClient = () => {
    const client = useContext(ClientContext)
    return client;
}