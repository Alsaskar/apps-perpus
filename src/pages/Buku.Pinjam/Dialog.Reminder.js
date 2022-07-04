import { Dialog, Classes, Button, Divider, Spinner, SpinnerSize, H3, H5 } from "@blueprintjs/core"
import { useState } from "react"
import { Alert } from "../../components"
import moment from "moment"
import axios from "axios"
import { url_api } from "../../config"

const DialogReminder = ({isOpen, onClose = () => { }, data }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')

    const handleReminder = async () => {
        setTimeout(async () => {
            const res = await axios.post(`${url_api}/pinjam-buku/reminder`, {
                no_hp: data.no_hp,
                waktu_pengembalian: moment(data.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days')
            })

            setMessage(res.data.message)
            setSuccess(res.data.success)
            setLoading(false)
            
            if(res.data.success){
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        }, 1000)

        setLoading(true)
    }

    return(
        <>
            <Dialog 
                isOpen={isOpen}
                title="Ingatkan Untuk Mengembalikan Buku" 
                isCloseButtonShown={false}
            >

                <div className={Classes.DIALOG_BODY}>
                    {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                    <H3 style={{textAlign: 'center'}}>Ingatkan {data.fullname}</H3>
                    <H5 style={{textAlign: 'center'}}>Ingatkan dia untuk mengembalikan buku yang dia pinjam. Karena batas waktu yang akan dikembalikan sisa {moment(data.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') + ' hari lagi'}</H5>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {loading ?
                        <Button intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                        : <Button intent="primary" onClick={() => handleReminder()}>Ya, Ingkatkan</Button>}

                        <Button intent="danger" onClick={() => onClose()}>Keluar</Button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default DialogReminder