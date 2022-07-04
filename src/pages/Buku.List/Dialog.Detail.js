import { Dialog, Classes, Button, Divider, H4, H5 } from "@blueprintjs/core"
import { url_api, openInNewTab } from "../../config"

const DialogDetail = ({
    isOpen,
    onClose = () => { },
    buku
}) => {
    
    return(
        <>
            <Dialog
                isOpen={isOpen}
                onClose={() => onClose()}
                title="Detail Buku"
                isCloseButtonShown={false}
            >

                <div className={Classes.DIALOG_BODY}>
                    <H4 style={{textAlign: 'center'}}>Dibawah ini adalah data dari detail buku</H4><Divider />

                    <center>
                        <Button onClick={() => openInNewTab(url_api + '/images/cover_buku/' + buku.foto_cover)}>
                        <img 
                            src={url_api + '/images/cover_buku/' + buku.foto_cover}
                            alt="Cover Buku"
                            style={{height: '200px'}}
                        />
                        </Button>
                    </center><Divider />

                    <div style={{marginTop: '2%'}}>
                        <H5><b>Judul</b> : {buku.judul}</H5>
                        <H5><b>Penulis</b> : {buku.penulis}</H5>
                        <H5><b>Penerbit</b> : {buku.penerbit}</H5>
                        <H5><b>Jumlah</b> : {buku.jumlah}</H5>
                        
                        <p><b>Deskripsi</b> : {buku.deskripsi}</p>
                    </div>
                </div><Divider />

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button intent="danger" onClick={() => onClose()}>
                            Keluar
                        </Button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default DialogDetail