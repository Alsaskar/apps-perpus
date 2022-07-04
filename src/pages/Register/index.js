import { Helmet } from "react-helmet"
import { Flex, Box, FormInput, Select, Alert } from "../../components"
import { Card, Elevation, H2, H3, Divider, Button, Spinner, SpinnerSize, Dialog, Classes, H5 } from "@blueprintjs/core"
import LogoPolimdo from '../../assets/images/logo-polimdo.png'
import { Formik } from "formik"
import * as Yup from 'yup'
import { useState, useEffect } from "react"
import axios from "axios"
import { url_api } from "../../config"
import { useHistory, Link } from "react-router-dom"
import { useTheme } from "@emotion/react"

const Schema = Yup.object().shape({
    fullname: Yup.string().required('tidak boleh kosong'),
    nim: Yup.string().min(6, 'minimal 6 digit').max(11, 'maximal 11 digit').required('tidak boleh kosong'),
    password: Yup.string().required('tidak boleh kosong'),
    c_password: Yup.string().required('tidak boleh kosong').oneOf([Yup.ref('password'), null], 'tidak cocok dengan password'),
    no_hp: Yup.string().min(10, 'minimal 10 digit').max(13, 'maximal 13 digit').required('tidak boleh kosong'),
    jurusan: Yup.string().required('tidak boleh kosong'),
    prodi: Yup.string().required('tidak boleh kosong'),
    kelas: Yup.string().required('tidak boleh kosong'),
    semester: Yup.string().required('tidak boleh kosong'),
    foto_kartu_mahasiswa: Yup.string().required('tidak boleh kosong'),
})

const Register = () => {
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const history = useHistory()
    const theme = useTheme()

    useEffect(() => {
        if(sessionStorage.getItem('token') !== null){
            history.push('/' + sessionStorage.getItem('role'))
        }
    }, [history])

    const prodi = [
        // Elektro
        {jurusan: "Teknik Elektro", name: "Teknik Informatika"},
        {jurusan: "Teknik Elektro", name: "Teknik Komputer"},
        {jurusan: "Teknik Elektro", name: "Teknik Listrik D4"},
        {jurusan: "Teknik Elektro", name: "Teknik Listrik D3"},

        // Mesin
        {jurusan: "Teknik Mesin", name: "Teknik Mesin D3"},
        {jurusan: "Teknik Mesin", name: "Teknik Mesin D4"},

        // Sipil
        {jurusan: "Teknik Sipil", name: "Teknik Sipil D3"},
        {jurusan: "Teknik Sipil", name: "Jalan Jembatan"},
        {jurusan: "Teknik Sipil", name: "Bangunan Gedung"},

        // Akuntansi
        {jurusan: "Akuntansi", name: "Perpajakan D4"},
        {jurusan: "Akuntansi", name: "Akuntansi D3"},

        // Administrasi Bisnis
        {jurusan: "Administrasi Bisnis", name: "Manajemen Pemasaran D3"},
        {jurusan: "Administrasi Bisnis", name: "Manajemen Bisnis D4"},
        {jurusan: "Administrasi Bisnis", name: "Administrasi Bisnis D3"},

        // Pariwisata
        {jurusan: "Pariwisata", name: "Usaha Perjalanan Wisata D3"},
        {jurusan: "Pariwisata", name: "Pariwisaata D3"},
        {jurusan: "Pariwisata", name: "Perhotelan D4"},
    ]

    return(
        <>
            <Helmet>
                <title>Daftar Sebagai Anggota</title>
            </Helmet>

            <Flex sx={{
                justifyContent: 'center',
            }}>
                <Box sx={{
                    mt: 4,
                    mb: 4,
                    width: 500
                }}>
                    <Card elevation={Elevation.ONE}>
                        <center><img src={LogoPolimdo} alt="Logo Polimdo" style={{height: "200px"}} /></center>
                        <H2 style={{textAlign: 'center'}}>Aplikasi Perpustakaan Politeknik Negeri Manado</H2><Divider />
                        <H3 style={{marginTop: '3%'}}>Daftar</H3>
                        <p>Daftar sebagai anggota sekarang</p>

                        <Dialog
                            isOpen={success}
                            onClose={() => setSuccess(false)}
                            title="Selamat! Berhasil mendaftar"
                            usePortal={true}
                            style={{
                                backgroundColor: theme.colors.green[6]
                            }}
                        >
                            <div className={Classes.DIALOG_BODY}>
                                <H5 style={{textAlign: 'center', color: 'white'}}>Berhasil mendaftar sebagai anggota. Sekarang Anda sudah bisa meminjam buku di perpustakaan</H5><Divider />

                                <div className="bp4-dialog-footer-actions" style={{marginTop: '4%'}}>
                                    <button className="bp4-button bp4-intent-light" onClick={() => {
                                        history.push('/')
                                    }}>Masuk ke Sistem</button>
                                </div>
                            </div>
                        </Dialog>

                        <Formik
                            initialValues={{
                                fullname: '',
                                nim: '',
                                password: '',
                                c_password: '',
                                no_hp: '',
                                jurusan: '',
                                prodi: '',
                                kelas: '',
                                semester: '',
                                foto_kartu_mahasiswa: ''
                            }}
                            validationSchema={Schema}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setTimeout(() => {
                                    const formData = new FormData()

                                    formData.append('fullname', values.fullname)
                                    formData.append('nim', values.nim)
                                    formData.append('password', values.password)
                                    formData.append('no_hp', values.no_hp)
                                    formData.append('jurusan', values.jurusan)
                                    formData.append('prodi', values.prodi)
                                    formData.append('kelas', values.kelas)
                                    formData.append('semester', values.semester)
                                    formData.append('foto_kartu_mahasiswa', values.foto_kartu_mahasiswa)

                                    axios.post(url_api + '/anggota/regis', formData)
                                    .then((res) => {
                                        setMessage(res.data.message)
                                        setSuccess(res.data.success)

                                        if(res.data.success){
                                            resetForm({values: ''})
                                        }
                                        
                                        setLoading(false)
                                        setSubmitting(false)
                                    })
                                }, 1000)

                                setLoading(true)
                            }}
                        >

                            {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (

                                <form onSubmit={handleSubmit} encType="multipart/form-data">

                                    {message !== '' ? <Alert message={message} intent={success ? "primary" : "danger"} style={{marginBottom: '2%'}}/> : null}

                                    <Box sx={{flex: 1}}>
                                        <FormInput
                                            label={"Nama Lengkap"}
                                            labelFor={"fullname"}
                                            helperText={errors.fullname && touched.fullname ? errors.fullname : null}
                                            type={"text"}
                                            placeholder="Masukkan Nama Lengkap"
                                            id={"fullname"}
                                            name={"fullname"}
                                            value={values.fullname}
                                            onChange={handleChange}
                                            intent={errors.fullname && touched.fullname ? "danger" : null}
                                        />
                                    </Box>
                                    
                                    <Flex sx={{flexFlow: 'row', justifyContent: 'space-between'}}>
                                        <Box sx={{flex: 1}}>
                                            <FormInput
                                                label={"NIM"}
                                                labelFor={"nim"}
                                                helperText={errors.nim && touched.nim ? errors.nim : null}
                                                type={"number"}
                                                placeholder="Masukkan NIM"
                                                id={"nim"}
                                                name={"nim"}
                                                value={values.nim}
                                                onChange={handleChange}
                                                intent={errors.nim && touched.nim ? "danger" : null}
                                            />
                                        </Box>&nbsp;&nbsp;

                                        <Box sx={{flex: 1}}>
                                            <div className="bp4-form-group">
                                                <label className="bp4-label" htmlFor="no_hp">Nomor HP</label>
                                                <div className="bp4-form-content">
                                                    <div className="bp4-input-group">
                                                        <span className="bp4-icon">+62</span>
                                                        <input 
                                                            type="text" 
                                                            id="no_hp"
                                                            name="no_hp"
                                                            className={errors.no_hp && touched.no_hp ? "bp4-input bp4-intent-danger" : "bp4-input"}
                                                            placeholder="Masukkan Nomor HP"
                                                            style={{marginLeft: '2%'}}
                                                            value={values.no_hp}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    {errors.no_hp && touched.no_hp ? <div className="bp4-form-helper-text"><font color="red">{errors.no_hp}</font></div> : <div className="bp4-form-helper-text">Contoh Pengisian : 896xxxxxxxx</div>}
                                                </div>
                                            </div>
                                        </Box>
                                    </Flex>
                                    <Flex sx={{flexFlow: 'row', justifyContent: 'space-between'}}>
                                        <Box sx={{flex: 1}}>
                                            <FormInput
                                                label={"Password"}
                                                labelFor={"password"}
                                                helperText={errors.password && touched.password ? errors.password : null}
                                                type={"password"}
                                                placeholder="Password"
                                                id={"password"}
                                                name={"password"}
                                                value={values.password}
                                                onChange={handleChange}
                                                intent={errors.password && touched.password ? "danger" : null}
                                            />
                                        </Box>&nbsp;&nbsp;

                                        <Box sx={{flex: 1}}>
                                            <FormInput
                                                label={"Ulangi Password"}
                                                labelFor={"c_password"}
                                                helperText={errors.c_password && touched.c_password ? errors.c_password : null}
                                                type={"password"}
                                                placeholder="Ulangi Password"
                                                id={"c_password"}
                                                name={"c_password"}
                                                value={values.c_password}
                                                onChange={handleChange}
                                                intent={errors.c_password && touched.c_password ? "danger" : null}
                                            />
                                        </Box>
                                    </Flex>

                                    <Flex sx={{flexFlow: 'row', justifyContent: 'space-between'}}>
                                        <Box sx={{flex: 1}}>
                                            <Select
                                                label="Pilih Jurusan"
                                                labelFor="jurusan"
                                                name="jurusan"
                                                id="jurusan"
                                                data={[
                                                    {name: "Teknik Elektro"}, 
                                                    {name: "Teknik Sipil"},
                                                    {name: "Teknik Mesin"},
                                                    {name: "Administrasi Bisnis"},
                                                    {name: "Pariwisata"},
                                                    {name: "Akuntansi"},
                                                ]}
                                                handleChange={handleChange}
                                                intent={errors.jurusan && touched.jurusan ? "bp4-intent-danger" : null}
                                                message={errors.jurusan && touched.jurusan ? errors.jurusan : null}
                                            />
                                        </Box>&nbsp;&nbsp;

                                        <Box sx={{flex: 1}}>
                                            <Select
                                                label="Pilih Program Studi"
                                                labelFor="prodi"
                                                name="prodi"
                                                id="prodi"
                                                data={prodi}
                                                handleChange={handleChange}
                                                intent={errors.prodi && touched.prodi ? "bp4-intent-danger" : null}
                                                message={errors.prodi && touched.prodi ? errors.prodi : null}
                                            />
                                        </Box>
                                    </Flex>

                                    <Flex sx={{flexFlow: 'row', justifyContent: 'space-between'}}>
                                        <Box sx={{flex: 1}}>
                                            <FormInput
                                                label={"Kelas"}
                                                labelFor={"kelas"}
                                                helperText={errors.kelas && touched.kelas ? errors.kelas : null}
                                                type={"text"}
                                                placeholder="Masukkan Kelas"
                                                id={"kelas"}
                                                name={"kelas"}
                                                value={values.kelas}
                                                onChange={handleChange}
                                                intent={errors.kelas && touched.kelas ? "danger" : null}
                                            />
                                        </Box>&nbsp;&nbsp;

                                        <Box sx={{flex: 1}}>
                                            <Select
                                                label="Pilih Semester"
                                                labelFor="semester"
                                                name="semester"
                                                id="semester"
                                                data={[
                                                    {name: "1"}, 
                                                    {name: "2"},
                                                    {name: "3"},
                                                    {name: "4"},
                                                    {name: "5"},
                                                    {name: "6"},
                                                    {name: "7"},
                                                    {name: "8"},
                                                ]}
                                                handleChange={handleChange}
                                                intent={errors.semester && touched.semester ? "bp4-intent-danger" : null}
                                                message={errors.semester && touched.semester ? errors.semester : null}
                                            />
                                        </Box>
                                    </Flex>

                                    <div className="bp4-form-group">
                                        <label htmlFor="foto_kartu_mahasiswa" style={{marginBottom: '1%'}}>Kartu Mahasiswa</label>
                                        <input 
                                            type='file'
                                            name='foto_kartu_mahasiswa'
                                            id='foto_kartu_mahasiswa'
                                            onChange={e => {
                                                setFieldValue('foto_kartu_mahasiswa', e.currentTarget.files[0])
                                            }}
                                        />
                                        {errors.foto_kartu_mahasiswa && touched.foto_kartu_mahasiswa ? <div className="bp4-form-helper-text"><font color="red">{errors.foto_kartu_mahasiswa}</font></div> : null}
                                    </div>

                                    {loading === true ?
                                        <Button style={{width: '30%'}} disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                                    : <Button type="submit" style={{width: '30%'}}>Daftar</Button>}

                                    <Divider style={{marginTop: '2%', marginBottom: '2%'}}/>
                                    <div align="center">Sudah menjadi anggota ? <Link to='/'>Masuk Ke Sistem</Link></div>
                                    
                                </form>

                            )}

                        </Formik>

                    </Card>
                </Box>
            </Flex>
        </>
    )
}

export default Register