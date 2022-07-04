import { useState } from "react"
import { Dialog, Classes, Button, Divider, Spinner, SpinnerSize, H4, H5 } from "@blueprintjs/core"
import { url_api } from "../../config"
import axios from "axios"
import { Alert } from "../../components"

const DialogDelete = ({
    isOpen,
    onClose = () => { },
    id,
    judulBuku
}) => {
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const deleteBuku = (id) => {
        setTimeout(async () => {
            const res = await axios.delete(url_api + '/buku/delete/' + id)
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
            <Dialog isOpen={isOpen} title="Hapus Buku" isCloseButtonShown={false}>
                <div className={Classes.DIALOG_BODY}>
                    {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                    <H4 style={{textAlign: 'center'}}>Yakin ingin menghapus data ini ?</H4>
                    <p align="center">Judul Buku : {judulBuku}</p>
                    <H5 style={{textAlign: 'center'}}>Data yang akan dihapus tidak dapat kembali</H5>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {loading ?
                        <Button style={{width: '10%'}} intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                        : <Button intent="primary" onClick={() => deleteBuku(id)}>Ya</Button> }

                        <Button intent="danger" onClick={() => {
                            onClose()
                        }}>Tidak</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default DialogDelete