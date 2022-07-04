import { useState, useEffect } from "react"
import { useClient, Header, Container, Flex, Box } from "../../components"
import imgUser from '../../assets/images/img-user.png'
import { Card, H4, Divider, H5, H3 } from "@blueprintjs/core"
import moment from 'moment'
import UploadFoto from "./UploadFoto"
import { url_api } from "../../config"

const ProfilAnggota = () => {
    const client = useClient()
    const [account, setAccount] = useState([])
    const [anggota, setAnggota] = useState([])

    useEffect(() => {
        client.account.then((value) => {
            setAccount(value)
            setAnggota(value.anggota.result[0])
        })
    }, [client])

    return(
        <>
            <Header 
               user={account}
            />

            <Container sx={{marginTop: '2%'}}>
                <Flex
                    sx={{
                        flexFlow: 'row',
                    }}
                >
                    <Box sx={{flexGrow: 1}}>
                        <Card>
                            <H4>Profil</H4><Divider />
                            {anggota.foto !== '' ?
                                <center><img src={url_api + '/images/' + anggota.foto} alt="User" style={{height: "130px", marginTop: '2%', borderRadius: '50%'}} /></center>
                            : <center><img src={imgUser} alt="User" style={{height: "130px", marginTop: '2%'}} /></center> }
                            <H3 style={{textAlign: 'center'}}>{account.fullname}</H3>
                            <H5 style={{textAlign: 'center'}}>{anggota.nim}</H5><Divider/>
                            
                            <Box style={{marginTop: '2%'}}>
                                <table width='100%'>
                                    <tbody>
                                        <tr>
                                            <td>Nomor HP</td>
                                            <td>:</td>
                                            <td>{anggota.no_hp === '' ? 'Belum punya nomor HP' : anggota.no_hp}</td>
                                        </tr>
                                        <tr>
                                            <td>Jurusan</td>
                                            <td>:</td>
                                            <td>{anggota.jurusan}</td>
                                        </tr>
                                        <tr>
                                            <td>Program Studi</td>
                                            <td>:</td>
                                            <td>{anggota.prodi}</td>
                                        </tr>
                                        <tr>
                                            <td>Kelas</td>
                                            <td>:</td>
                                            <td>{anggota.semester + " " + anggota.kelas}</td>
                                        </tr>
                                        <tr>
                                            <td>Semester</td>
                                            <td>:</td>
                                            <td>{anggota.semester}</td>
                                        </tr>
                                        <tr>
                                            <td>Tanggal Bergabung</td>
                                            <td>:</td>                                            
                                            <td>{moment(anggota.tgl_join).format('DD-MM-YYYY')}</td>
                                        </tr>
                                    </tbody>
                                </table><Divider />

                                {/* Kartu Mahasiswa */}
                                <H4 style={{textAlign: 'center'}}>Kartu Mahasiswa</H4>
                                <center><img src={url_api + '/images/kartu_mahasiswa/' + anggota.foto_kartu_mahasiswa} alt="User" style={{height: "200px", marginTop: '2%'}} /></center>

                            </Box>
                        </Card>
                    </Box>&nbsp;&nbsp;
                    <Box sx={{flexGrow: 1}}>
                        <Card>
                            <Box className="upload-foto">
                                <H4>Upload Foto Profil</H4><Divider />
                                <Box style={{marginTop: '3%'}}>
                                    <UploadFoto id_user={anggota.id_user} />
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </Flex>

            </Container>
        </>
    )
}

export default ProfilAnggota