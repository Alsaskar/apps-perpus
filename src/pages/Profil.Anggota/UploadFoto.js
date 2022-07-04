import {Formik} from 'formik'
import * as Yup from 'yup'
import { Button, Divider, Spinner, SpinnerSize, H5 } from '@blueprintjs/core'
import { useState } from 'react'
import { Alert } from '../../components'
import axios from 'axios'
import { url_api } from '../../config'

const Schema = Yup.object().shape({
    foto: Yup.string().required('foto tidak boleh kosong'),
})

const UploadFoto = ({id_user}) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState('')
    const [viewImg, setViewImg] = useState('')

    return(
        <>
            <Formik
                initialValues={{foto : null}}
                validationSchema={Schema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    const formData = new FormData()
                    formData.append('foto', values.foto)

                    setTimeout(() => {
                        axios.post(url_api + '/anggota/upload-foto/' + id_user, formData).then((res) => {
                            setSuccess(res.data.success)
                            setMessage(res.data.message)
                            setLoading(false)
                            setSubmitting(false)

                            // jika berhasil
                            if(res.data.success){
                                setTimeout(() => {
                                    // redirect
                                    window.location.reload();
                                }, 2000)
                            }
                        })
                    }, 1000)
                    setLoading(true)
                }}
            >

                {({ values, errors, touched, setFieldValue, handleSubmit }) => (

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        {message !== '' ? <Alert message={message} intent={success ? "primary" : "danger"} style={{marginBottom: '2%'}}/> : null}

                        {errors.foto && touched.foto ? <Alert intent={'danger'} message={errors.foto} style={{marginBottom: '2%'}} /> : null}
                        
                        <input 
                            type='file'
                            name='foto'
                            id='foto'
                            onChange={e => {
                                setFieldValue('foto', e.currentTarget.files[0])
                                if (e.target.files && e.target.files.length > 0) {
                                    setViewImg(e.target.files[0]);
                                }
                            }}
                            
                            style={{marginBottom: '2%'}}
                        /><Divider/>

                        {viewImg !== '' ? <><center><H5>Preview Foto</H5><img src={URL.createObjectURL(viewImg)} alt="Preview" style={{height: '130px', borderRadius: '50%'}} /></center><br/></> : null}

                        {loading === true ?
                            <Button type="submit" intent='primary' style={{width: '30%', marginTop: '2%'}} disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                        : <Button type="submit" intent='primary' style={{width: '30%', marginTop: '2%'}}>Simpan</Button>}
                    </form>

                )}

            </Formik>
        </>
    )
}

export default UploadFoto