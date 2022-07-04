import { Box, Flex, FormInput, Alert } from "../../components"
import { Card, Elevation, Button, H3, H2, Divider, Spinner, SpinnerSize } from "@blueprintjs/core"
import LogoPolimdo from '../../assets/images/logo-polimdo.png'
import {Formik} from 'formik'
import * as Yup from 'yup'
import { useState } from "react"
import axios from 'axios'
import {url_api} from '../../config'
import { useEffect } from "react"
import { useHistory, Link } from "react-router-dom"
import { Helmet } from "react-helmet"

const Schema = Yup.object().shape({
    username: Yup.string().required('tidak boleh kosong'),
    password: Yup.string().required('tidak boleh kosong')
})

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const history = useHistory()

    useEffect(() => {
        if(sessionStorage.getItem('token') !== null){
            history.push('/' + sessionStorage.getItem('role'))
        }
    }, [history])

    return(
        <>
            <Helmet>
                <title>Aplikasi Perpustakaan Polimdo</title>
            </Helmet>
            <Flex sx={{
                justifyContent: 'center',
            }}>
                <Box sx={{
                    mt: 4,
                    mb: 4,
                    width: 450
                }}>
                    <Card elevation={Elevation.ONE}>
                        <center><img src={LogoPolimdo} alt="Logo Polimdo" style={{height: "200px"}} /></center>
                        <H2 style={{textAlign: 'center'}}>Aplikasi Perpustakaan Politeknik Negeri Manado</H2><Divider />
                        <H3 style={{marginTop: '3%'}}>Login</H3>
                        <p>Silahkan login untuk masuk ke sistem</p>

                        {/* jika gagal login, muncul alert */}
                        {message !== '' ? <Alert message={message} intent={success ? null : "danger"} style={{marginBottom: '15px'}}/> : null}

                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            validationSchema={Schema}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setTimeout(() => {
                                    axios.post(url_api + '/auth/login', {
                                        username: values.username,
                                        password: values.password
                                    }).then((res) => {
                                        setSuccess(res.data.success)
                                        
                                        if(res.data.success){
                                            // menyimpan token & role
                                            sessionStorage.setItem('token', res.data.token)
                                            sessionStorage.setItem('role', res.data.role)

                                            // redirect
                                            history.push('/' + res.data.role)
                                            
                                        }else{
                                            resetForm({values: ''})
                                            setMessage(res.data.message)
                                        }

                                        setLoading(false)
                                        setSubmitting(false)
                                    })
                                }, 1000)

                                setLoading(true)
                            }}
                        >

                            {({ values, errors, touched, handleSubmit, handleChange }) => (

                                <form onSubmit={handleSubmit}>
                                    <FormInput
                                        label={"Username"}
                                        labelFor={"username"}
                                        helperText={errors.username && touched.username ? errors.username : null}
                                        type={"text"}
                                        placeholder="Username"
                                        id={"username"}
                                        name={"username"}
                                        value={values.username}
                                        onChange={handleChange}
                                        intent={errors.username && touched.username ? "danger" : null}
                                    />
                                    <FormInput
                                        label={"Password"}
                                        labelFor={"password"}
                                        helperText={errors.password && touched.password ? errors.password : null}
                                        type={"password"}
                                        placeholder="password"
                                        id={"password"}
                                        name={"password"}
                                        value={values.password}
                                        onChange={handleChange}
                                        intent={errors.password && touched.password ? "danger" : null}
                                    />
                                    {loading === true ?
                                        <Button type="submit" style={{width: '30%'}} disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                                    : <Button type="submit" style={{width: '30%'}}>Login</Button>}

                                    <Divider style={{marginTop: '2%', marginBottom: '2%'}}/>
                                    <div align="center">Belum menjadi anggota ? <Link to='/regis'>Daftar Sekarang</Link></div>
                                </form>

                            )}

                        </Formik>

                    </Card>
                </Box>
            </Flex>
        </>
    )
}

export default Login