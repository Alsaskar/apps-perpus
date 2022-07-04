import { Dialog, Classes, Button, Divider, Spinner, SpinnerSize } from "@blueprintjs/core"
import { useState, useEffect } from "react"
import axios from "axios"
import Select from 'react-select'
import * as Yup from 'yup'
import { url_api } from "../../config"
import { Formik } from "formik"
import { Alert, FormInput } from "../../components"

const Schema = Yup.object().shape({
    id_anggota: Yup.string().required('tidak boleh kosong'),
    id_buku: Yup.string().required('tidak boleh kosong'),
    tgl_pinjam: Yup.string().required('tidak boleh kosong'),
    tgl_pengembalian: Yup.string().required('tidak boleh kosong'),
})

const DialogAdd = ({isOpen, onClose = () => { } }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [peminjam, setPeminjam] = useState([])
    const [meminjamBuku, setMeminjamBuku] = useState([])

    const dataPeminjam = []
    const dataBuku = []

    useEffect(() => {
        const fetchPeminjam = async () => {
            const res = await axios.get(url_api + '/anggota/list-peminjam')
            res.data.result.map((val) => {
                dataPeminjam.push({
                    label: val.fullname,
                    value: val.idAnggota
                })

                return dataPeminjam
            })

            const response = await axios.get(url_api + '/buku/list-meminjam')
            response.data.result.map((val) => {
                dataBuku.push({
                    label: val.judul,
                    value: val.idBuku
                })

                return dataBuku
            })

            setPeminjam(dataPeminjam)
            setMeminjamBuku(dataBuku)
        }

        fetchPeminjam()
    }, [])

    return(
        <>
            <Dialog 
                isOpen={isOpen}
                title="Meminjam Buku" 
                isCloseButtonShown={false}
            >

                <Formik
                    initialValues={{
                        id_anggota: '',
                        id_buku: '',
                        tgl_pinjam: '',
                        tgl_pengembalian: ''
                    }}
                    validationSchema={Schema}
                    onSubmit={(values, {resetForm}) => {
                        setTimeout(async () => {
                            const res = await axios.post(url_api + '/pinjam-buku/add', {
                                id_buku: values.id_buku,
                                id_anggota: values.id_anggota,
                                tgl_pinjam: values.tgl_pinjam,
                                tgl_pengembalian: values.tgl_pengembalian
                            })

                            if(res.data.success){
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            }

                            setMessage(res.data.message)
                            setSuccess(res.data.success)

                            resetForm({value: ''})
                            setLoading(false)
                        }, 1000)

                        setLoading(true)
                    }}
                >

                    {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                        
                            <div className={Classes.DIALOG_BODY}>
                                {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                                <div className="bp4-form-group">
                                    <label className="bp4-label" htmlFor="id_anggota">Nama Peminjam</label>
                                    <Select 
                                        options={peminjam}
                                        id="id_anggota"
                                        name="id_anggota"
                                        onChange={(e) => {
                                            setFieldValue('id_anggota', e.value)
                                        }}
                                    />

                                    {errors.id_anggota && touched.id_anggota ? <div className="bp4-form-helper-text"><font color="red">{errors.id_anggota}</font></div> : null}
                                </div>

                                <div className="bp4-form-group">
                                    <label className="bp4-label" htmlFor="id_buku">Judul Buku</label>
                                    <Select 
                                        options={meminjamBuku}
                                        id="id_buku"
                                        name="id_buku"
                                        onChange={(e) => {
                                            setFieldValue('id_buku', e.value)
                                        }}
                                    />

                                    {errors.id_buku && touched.id_buku ? <div className="bp4-form-helper-text"><font color="red">{errors.id_buku}</font></div> : null}
                                </div>

                                <FormInput
                                    label={"Tanggal Meminjam"}
                                    labelFor={"tgl_pinjam"}
                                    helperText={errors.tgl_pinjam && touched.tgl_pinjam ? errors.tgl_pinjam : null}
                                    type={"date"}
                                    id={"tgl_pinjam"}
                                    name={"tgl_pinjam"}
                                    value={values.tgl_pinjam}
                                    onChange={handleChange}
                                    intent={errors.tgl_pinjam && touched.tgl_pinjam ? "danger" : null}
                                />

                                <FormInput
                                    label={"Tanggal Pengembalian"}
                                    labelFor={"tgl_pengembalian"}
                                    helperText={errors.tgl_pengembalian && touched.tgl_pengembalian ? errors.tgl_pengembalian : null}
                                    type={"date"}
                                    id={"tgl_pengembalian"}
                                    name={"tgl_pengembalian"}
                                    value={values.tgl_pengembalian}
                                    onChange={handleChange}
                                    intent={errors.tgl_pengembalian && touched.tgl_pengembalian ? "danger" : null}
                                />
                            </div><Divider />
                            <div className={Classes.DIALOG_FOOTER}>
                                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                    {loading ?
                                    <Button intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                                    : <Button intent="primary" type="submit">Simpan</Button>}

                                    <Button intent="danger" onClick={() => onClose()}>Keluar</Button>
                                </div>
                            </div>
                        </form>
                    )}

                </Formik>

            </Dialog>
        </>
    )
}

export default DialogAdd