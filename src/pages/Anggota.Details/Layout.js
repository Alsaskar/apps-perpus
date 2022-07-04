import { Flex, Box, Container, Alert } from "../../components"
import { Card, Divider, H4, H3, H5, Button, Dialog, Classes, Spinner, SpinnerSize } from "@blueprintjs/core"
import imgUser from '../../assets/images/img-user.png'
import { url_api } from "../../config"
import moment from "moment"
import { useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"

const Layout = ({data}) => {
    const [openAccept, setOpenAccept] = useState(false)
    const [openReject, setOpenReject] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [alasanDitolak, setAlasanDiTolak] = useState('')

    // loading
    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingReject, setLoadingReject] = useState(false)

    const history = useHistory()

    // menerima anggota
    const accept = async () => {
        setTimeout(async () => {
            const res = await axios.put(url_api + '/anggota/accept/' + data.id, {
                no_hp: data.no_hp
            })
            setSuccess(res.data.success)
            setMessage(res.data.message)
            setLoadingAccept(false)

            if(res.data.success){
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }, 1000)

        setLoadingAccept(true)
    }

    // menolak anggota
    const reject = async (e) => {
        e.preventDefault()
        setTimeout(async () => {
            const res = await axios.put(url_api + '/anggota/reject/' + data.id, {
                alasan_ditolak: alasanDitolak,
                no_hp: data.no_hp
            })
            setSuccess(res.data.success)
            setMessage(res.data.message)
            setLoadingReject(false)

            if(res.data.success){
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }, 1000)

        setLoadingReject(true)
    }

    return(
        <Container>
            <Flex sx={{justifyContent: 'space-around', marginTop: '2%'}}>
                <Box style={{width: '45%'}}>
                    <Card>
                        <H4>Profil Anggota</H4><Divider />

                        {data.foto !== '' ?
                        <center><img src={url_api + '/images/' + data.foto} alt="User" style={{height: "130px", marginTop: '2%', borderRadius: '50%'}} /></center>
                        : <center><img src={imgUser} alt="User" style={{height: "130px", marginTop: '2%'}} /></center> }
                        <H3 style={{textAlign: 'center'}}>{data.fullname}</H3>
                        <H5 style={{textAlign: 'center'}}>{data.nim}</H5><Divider/>

                        <Box style={{marginTop: '2%'}}>
                                <table width='100%'>
                                    <tbody>
                                        <tr>
                                            <td>Nomor HP</td>
                                            <td>:</td>
                                            <td>{data.no_hp === '' ? 'Belum punya nomor HP' : data.no_hp}</td>
                                        </tr>
                                        <tr>
                                            <td>Jurusan</td>
                                            <td>:</td>
                                            <td>{data.jurusan}</td>
                                        </tr>
                                        <tr>
                                            <td>Program Studi</td>
                                            <td>:</td>
                                            <td>{data.prodi}</td>
                                        </tr>
                                        <tr>
                                            <td>Kelas</td>
                                            <td>:</td>
                                            <td>{data.semester + " " + data.kelas}</td>
                                        </tr>
                                        <tr>
                                            <td>Semester</td>
                                            <td>:</td>
                                            <td>{data.semester}</td>
                                        </tr>
                                        <tr>
                                            <td>Tanggal Bergabung</td>
                                            <td>:</td>                                            
                                            <td>{moment(data.tgl_join).format('DD-MM-YYYY')}</td>
                                        </tr>
                                    </tbody>
                                </table><Divider />

                                <Box style={{marginTop: '2%'}}>
                                    {data.verified === 'diterima' ?
                                    <>
                                        <H4 style={{color: 'green', textAlign: 'center'}}>Anggota Ini Telah Diterima</H4>
                                        <p style={{textAlign: 'center'}}>Sudah bisa meminjam buku</p>
                                    </>
                                    : data.verified === 'ditolak' ?
                                    <>
                                        <H4 style={{color: 'red', textAlign: 'center'}}>Anggota Ini Ditolak</H4>
                                        <p style={{textAlign: 'center'}}>Tidak bisa meminjam buku</p>
                                    </>
                                    :
                                    <>
                                        <H4 style={{color: 'red', textAlign: 'center'}}>Anggota Ini Belum Diterima</H4>
                                        <p style={{textAlign: 'center'}}>Menunggu untuk diterima</p>
                                    </>}
                                </Box><Divider style={{marginBottom: '3%'}} />

                                <Button intent="danger" onClick={() => history.push('/anggota')}>Kembali</Button>

                            </Box>

                    </Card>
                </Box>
                <Box style={{width: '45%'}}>
                    <Card>
                        <H4>Kartu Mahasiswa</H4><Divider />

                        <center>
                            <a href={url_api + '/images/kartu_mahasiswa/' + data.foto_kartu_mahasiswa}><img src={url_api + '/images/kartu_mahasiswa/' + data.foto_kartu_mahasiswa} alt="User" style={{width: '100%', marginTop: '2%'}} /></a>
                        </center><Divider />

                        {data.verified === 'proses' ?
                        <Flex style={{marginTop: '2%'}}>
                            <Box style={{width: '15%'}}>
                                <Button intent="primary" onClick={() => {
                                    setOpenAccept(true)
                                }}>Terima</Button>
                            </Box>
                            <Box>
                                <Button intent="danger" onClick={() => {
                                    setOpenReject(true)
                                }}>Tolak</Button>
                            </Box>
                        </Flex>
                        : null}
                    </Card>
                </Box>
            </Flex>

            {/* Dialog Accept */}
            <Dialog isOpen={openAccept} title="Menerima Anggota">
                <div className={Classes.DIALOG_BODY}>

                    {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                    <H4 style={{textAlign: 'center'}}>Yakin ingin menerima anggota yang bernama {data.fullname}</H4><Divider />

                    <div className={Classes.DIALOG_FOOTER} style={{marginTop: '2%'}}>
                        <div className="bp4-dialog-footer-actions">
                            
                            {loadingAccept ?
                            <Button style={{width: '10%'}} intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                            : <Button intent="primary" onClick={() => accept()}>Ya</Button> }

                            <Button intent="danger" onClick={() => setOpenAccept(false)}>Tidak</Button>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Dialog Reject */}
            <Dialog isOpen={openReject} title="Tolak Anggota">
                <form onSubmit={reject} method="post">
                    <div className={Classes.DIALOG_BODY}>

                        {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                        <H4 style={{textAlign: 'center'}}>Yakin ingin menolak anggota yang bernama {data.fullname} ?</H4><Divider />

                        <textarea 
                            name="alasan_ditolak"
                            id="alasan_ditolak"
                            className="bp4-input" 
                            style={{width: '100%'}}
                            placeholder="Masukkan Keterangan Ditolak"
                            required
                            onChange={(e) => setAlasanDiTolak(e.target.value)}
                        ></textarea><Divider />

                        <div className={Classes.DIALOG_FOOTER} style={{marginTop: '2%'}}>
                            <div className="bp4-dialog-footer-actions">

                                {loadingReject ?
                                <Button style={{width: '10%'}} intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                                : <Button intent="primary" type="submit">Ya</Button> }

                                <Button intent="danger" onClick={() => setOpenReject(false)}>Tidak</Button>
                                
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>

        </Container>
    )
}

export default Layout