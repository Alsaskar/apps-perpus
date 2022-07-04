import { Container, Header, useClient } from "../../components"
import { useState } from "react"
import { useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import { url_api } from "../../config"
import { Card, Divider, H3 } from "@blueprintjs/core"
import moment from "moment"

const DataPinjamBuku = () => {
    const client = useClient()
    const [account, setAccount] = useState([])
    const [list, setList] = useState([])

    useEffect(() => {
        client.account.then(async (value) => {
            setAccount(value)

            const res = await axios.get(`${url_api}/pinjam-buku/list-peminjam/${value.anggota.result[0].id}`)
            setList(res.data.result)
        })
    }, [client])

    return(
        <>
            <Helmet>
                <title>Buku Yang Dipinjam</title>
            </Helmet>

            <Header 
                user={account} 
            />

            <Container style={{marginTop: '3%'}}>
                <Card>
                    <H3>Data Buku</H3>
                    <p>Data Buku yang Anda pinjam</p><Divider />

                    <table style={{width: '100%'}} className="bp4-html-table bp4-html-table-striped bp4-html-table-bordered bp4-html-table-condensed">
                        <thead>
                        <tr>
                            <th>Judul Buku</th>
                            <th>Penulis</th>
                            <th>Penerbit</th>
                            <th>Tanggal Meminjam</th>
                            <th>Tanggal Pengembalian</th>
                            <th>Waktu Pengembalian</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ?
                                list.map((val, key) => {                                    
                                    return <tr key={key}>
                                        <td>{val.judul}</td>
                                        <td>{val.penulis}</td>
                                        <td>{val.penerbit}</td>
                                        <td>{moment(val.tgl_pinjam).format('DD-MM-YYYY')}</td>
                                        <td>{moment(val.tgl_pengembalian).format('DD-MM-YYYY')}</td>
                                        <td>
                                            {moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') > 0 ? // jika tgl pengembalian belum lewat
                                                moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') + ' hari lagi'
                                            : moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 0 ? "Hari ini. Segera dikembalikan"
                                            : val.status === 'sudah dikembalikan' ? '-' : <font color="red">Sudah lewat. Dikenakan Denda. Mohon Dikembalikan</font>}
                                        </td>
                                        <td>{
                                            val.status === 'sudah dikembalikan' ? <font color="green">Sudah Dikembalikan</font> :
                                            <font color="red">Belum Dikembalikan</font>}
                                        </td>
                                    </tr>
                                })
                            :
                            <tr>
                                <td colSpan={7} style={{textAlign: 'center'}}>Belum meminjam buku. Silahkan pergi ke perpustakaan untuk meminjam buku</td>
                            </tr>
                            }
                        </tbody>
                    </table><Divider />
                </Card>
            </Container>
        </>
    )
}

export default DataPinjamBuku