import { Header, useClient } from "../../components"
import { Helmet } from "react-helmet"
import Layout from "./Layout"

const PinjamBuku = () => {
    const client = useClient()

    return(
        <>
            <Helmet>
                <title>Meminjam Buku</title>
            </Helmet>

            <Header 
               user={client.account} 
            />

            <Layout />
        </>
    )
}

export default PinjamBuku