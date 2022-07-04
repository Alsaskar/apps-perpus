import { Dialog, Classes, Button, Divider, Spinner, SpinnerSize, H3, H5 } from "@blueprintjs/core"
import { useState } from "react"
import { Alert } from "../../components"
import moment from 'moment'
import axios from "axios"
import { url_api } from "../../config"

const DialogPengembalian = ({
    isOpen,
    onClose = () => { },
    data
}) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')

    const handlePengembalian = async () => {
        setTimeout(async () => {
            if(moment(data.tgl_pengembalian).diff(moment(), 'days') >= 0){ // jika belum lewat waktu
                const res = await axios.post(`${url_api}/pengembalian-buku/add`, {
                    id_pinjam_buku: data.id,
                    id_anggota: data.id_anggota,
                    id_buku: data.id_buku,
                    total_harga_denda: 0,
                    status: 'tidak kena denda',
                    tgl_dikembalikan: moment().format("YYYY-MM-DD"),
                    jumlah_buku: data.jumlah
                })

                setMessage(res.data.message)
                setSuccess(res.data.success)
                setLoading(false)

                if(res.data.success){
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }else{ // jika sudah lewat waktu
                const res = await axios.post(`${url_api}/pengembalian-buku/add`, {
                    id_pinjam_buku: data.id,
                    id_anggota: data.id_anggota,
                    id_buku: data.id_buku,
                    total_harga_denda: 3000,
                    status: 'kena denda',
                    tgl_dikembalikan: moment().format("YYYY-MM-DD"),
                    jumlah_buku: data.jumlah
                })

                setMessage(res.data.message)
                setSuccess(res.data.success)
                setLoading(false)

                if(res.data.success){
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }
        }, 1000)

        setLoading(true)
    }

    return(
        <>
            <Dialog 
                isOpen={isOpen}
                title="Kembalikan Buku" 
                isCloseButtonShown={false}
            >
                <div className={Classes.DIALOG_BODY}>
                    {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}
                    
                    <H3 style={{textAlign: 'center'}}>Data Peminjam</H3>
                    <p align="center">Dibawah ini adalah data peminjam</p><Divider />

                    {moment(data.tgl_pengembalian).diff(moment(), 'days') < 0 ? <Alert intent="danger" message="Anda kena denda sebesar Rp. 3.000. Karena buku yang akan dikembalikan sudah lewat tanggal pengembaliannya"/> : null}

                    <table width="100%">
                        <tbody>
                            <tr>
                                <td>Nama</td>
                                <td>:</td>
                                <td>{data.fullname}</td>
                            </tr>
                            <tr>
                                <td>NIM</td>
                                <td>:</td>
                                <td>{data.nim}</td>
                            </tr>
                            <tr>
                                <td>Judul Buku</td>
                                <td>:</td>
                                <td>{data.judul}</td>
                            </tr>
                            <tr>
                                <td>Tanggal Peminjaman</td>
                                <td>:</td>
                                <td>{moment(data.tgl_pinjam).format('DD-MM-YYYY')}</td>
                            </tr>
                            <tr>
                                <td>Tanggal Pengembalian</td>
                                <td>:</td>
                                <td>{moment(data.tgl_pengembalian).format('DD-MM-YYYY')}</td>
                            </tr>
                        </tbody>
                    </table><Divider />

                    <H5 style={{textAlign: 'center'}}>Yakin ingin mengembalikan buku <b>{data.judul}</b> ?</H5><Divider />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {loading ?
                        <Button intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                        : <Button intent="primary" onClick={() => handlePengembalian()}>Ya</Button>}

                        <Button intent="danger" onClick={() => onClose()}>Tidak</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default DialogPengembalian