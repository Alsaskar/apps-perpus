import Layout from "./Layout"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import {useEffect, useState} from 'react'
import axios from 'axios'
import {url_api} from '../../config'
import { useClient, Header } from "../../components"
import { useMemo } from "react"

const DetailAnggota = () => {
    const params = useParams()
    const [fullname, setFullname] = useState('')
    const [data, setData] = useState([])
    const client = useClient()

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(url_api + '/anggota/detail/' + params["id_anggota"])
            setData(res.data.result[0])
            setFullname(res.data.result[0].fullname)
        }

        fetch()
    }, [params])

    const dataUser = useMemo(() => {
        return{
            data,
            fullname
        }
    }, [data, fullname])

    return(
        <>
            <Helmet>
                <title>Anggota - {dataUser.fullname}</title>
            </Helmet>

            <Header 
               user={client.account} 
            />

            <Layout data={dataUser.data}/>
        </>
    )
}

export default DetailAnggota