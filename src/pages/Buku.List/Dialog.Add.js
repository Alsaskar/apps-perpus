import { Dialog, Classes, Button, Divider, Spinner, SpinnerSize } from "@blueprintjs/core"
import axios from "axios"
import { Formik } from "formik"
import { useState } from "react"
import * as Yup from 'yup'
import { FormInput, Alert } from "../../components"
import { url_api } from "../../config"

const Schema = Yup.object().shape({
    judul: Yup.string().required('tidak boleh kosong'),
    penulis: Yup.string().required('tidak boleh kosong'),
    penerbit: Yup.string().required('tidak boleh kosong'),
    foto_cover: Yup.string().required('tidak boleh kosong'),
    jumlah: Yup.string().required('tidak boleh kosong')
})

const DialogAdd = ({
    isOpen,
    onClose = () => { }
}) => {
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    return(
        <Dialog 
            isOpen={isOpen}
            title="Tambahkan Buku" 
            isCloseButtonShown={false}
        >
            <Formik
                initialValues={{
                    judul: '',
                    penulis: '',
                    penerbit: '',
                    foto_cover: '',
                    jumlah: ''
                }}
                validationSchema={Schema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    const formData = new FormData()

                    formData.append('judul', values.judul)
                    formData.append('penulis', values.penulis)
                    formData.append('penerbit', values.penerbit)
                    formData.append('foto_cover', values.foto_cover)
                    formData.append('jumlah', values.jumlah)
                    formData.append('deskripsi', values.deskripsi)

                    setTimeout(async () => {
                        const res = await axios.post(url_api + '/buku/add', formData)
                        setMessage(res.data.message)
                        setSuccess(res.data.success)

                        if(res.data.success){ // jika berhasil
                            resetForm({values: ''})
                            setTimeout(() => {
                                window.location.reload()
                            }, 1000)
                        }

                        setLoading(false)
                    }, 1000)

                    setLoading(true)
                }}
            >

                {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className={Classes.DIALOG_BODY}>

                            {message !== '' ? <><Alert intent={success ? "success" : "danger"} message={message} /><Divider /></> : null}

                            <FormInput
                                label={"Judul Buku"}
                                labelFor={"judul"}
                                helperText={errors.judul && touched.judul ? errors.judul : null}
                                type={"text"}
                                placeholder="Masukkan Judul Buku"
                                id={"judul"}
                                name={"judul"}
                                value={values.judul}
                                onChange={handleChange}
                                intent={errors.judul && touched.judul ? "danger" : null}
                            />

                            <FormInput
                                label={"Penulis Buku"}
                                labelFor={"penulis"}
                                helperText={errors.penulis && touched.penulis ? errors.penulis : null}
                                type={"text"}
                                placeholder="Masukkan Penulis Buku"
                                id={"penulis"}
                                name={"penulis"}
                                value={values.penulis}
                                onChange={handleChange}
                                intent={errors.penulis && touched.penulis ? "danger" : null}
                            />

                            <FormInput
                                label={"Penerbit Buku"}
                                labelFor={"penerbit"}
                                helperText={errors.penerbit && touched.penerbit ? errors.penerbit : null}
                                type={"text"}
                                placeholder="Masukkan Penerbit Buku"
                                id={"penerbit"}
                                name={"penerbit"}
                                value={values.penerbit}
                                onChange={handleChange}
                                intent={errors.penerbit && touched.penerbit ? "danger" : null}
                            />

                            <FormInput
                                label={"Jumlah Buku"}
                                labelFor={"penerbit"}
                                helperText={errors.jumlah && touched.jumlah ? errors.jumlah : null}
                                type={"number"}
                                placeholder="Masukkan Jumlah Buku"
                                id={"jumlah"}
                                name={"jumlah"}
                                value={values.jumlah}
                                onChange={handleChange}
                                intent={errors.jumlah && touched.jumlah ? "danger" : null}
                            />

                            <div className="bp4-form-group">
                                <label htmlFor="foto_cover" style={{marginBottom: '1%'}}>Cover Buku</label>
                                <input 
                                    type='file'
                                    name='foto_cover'
                                    id='foto_cover'
                                    onChange={e => {
                                        setFieldValue('foto_cover', e.currentTarget.files[0])
                                    }}
                                />
                                {errors.foto_cover && touched.foto_cover ? <div className="bp4-form-helper-text"><font color="red">{errors.foto_cover}</font></div> : null}
                            </div>

                            <div className="bp4-form-group">
                                <label htmlFor="deskripsi" style={{marginBottom: '1%'}}>Deskripsi</label>
                                <textarea
                                    className="bp4-input"
                                    name="deskripsi"
                                    id="deskripsi"
                                    onChange={handleChange}
                                    placeholder="Masukkan Deskripsi"
                                    rows={4}
                                ></textarea>
                                {errors.deskripsi && touched.deskripsi ? <div className="bp4-form-helper-text"><font color="red">{errors.deskripsi}</font></div> : null}
                            </div>
                            
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
    )
}

export default DialogAdd