import { Container, Flex, Header, useClient } from "../../components"
import { H4, H6, Divider,  } from "@blueprintjs/core"
import { useTheme } from "@emotion/react"
import CardCount from "./CardCount"
import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import { url_api } from "../../config"

const AdminDashboard = () => {
    const client = useClient()
    const theme = useTheme()

    const [totalBuku, setTotalBuku] = useState(null)
    const [totalAnggota, setTotalAnggota] = useState(null)
    const [totalPeminjam, setTotalPeminjam] = useState(null)
    const [totalPengembalian, setTotalPengembalian] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            const buku = await axios.get(url_api + '/buku/count')
            setTotalBuku(buku.data.total)

            const anggota = await axios.get(url_api + '/anggota/count')
            setTotalAnggota(anggota.data.total)

            const peminjam = await axios.get(url_api + '/pinjam-buku/count')
            setTotalPeminjam(peminjam.data.total)

            const pengembalian = await axios.get(url_api + '/pengembalian-buku/count')
            setTotalPengembalian(pengembalian.data.total)
        }

        fetch()
    }, [])

    return(
        <>
            <Header 
               user={client.account} 
            />
            
            <Container sx={{marginTop: '3%'}}>
                <H4 style={{textAlign: 'center'}}>Selamat Datang, {client.account.fullname}</H4>
                <H6 style={{textAlign: 'center'}}>Anda login sebagai Admin, silahkan untuk mengelola sistem ini</H6><Divider />

                <Flex sx={{
                    justifyContent: 'space-between',
                    marginTop: '2%'
                }}>

                    <CardCount 
                        title="Data Anggota"
                        subtitle="Total anggota yang terdaftar"
                        background={theme.colors.red[6]}
                        colorTitle="white"
                        color="white"
                        count={totalAnggota}
                        icon="user"
                    />

                    <CardCount 
                        title="Data Buku"
                        subtitle="Total buku yang tersedia"
                        background={theme.colors.green[6]}
                        colorTitle="white"
                        color="white"
                        count={totalBuku}
                        icon="book"
                    />

                    <CardCount 
                        title="Data Pinjaman"
                        subtitle="Total buku yang belum dikembalikan"
                        background={theme.colors.blue[6]}
                        colorTitle="white"
                        color="white"
                        count={totalPeminjam}
                        icon="database"
                    />

                    <CardCount 
                        title="Pengembalian Buku"
                        subtitle="Total buku yang sudah dikembalikan"
                        background={theme.colors.black}
                        colorTitle="white"
                        color="white"
                        count={totalPengembalian}
                        icon="horizontal-bar-chart-desc"
                    />

                </Flex>
            </Container>

        </>
    )
}

export default AdminDashboard