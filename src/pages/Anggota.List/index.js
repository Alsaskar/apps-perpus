import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { Container, Header, useClient, Flex, Box, Select, Alert } from "../../components"
import { url_api } from "../../config"
import { Button, Card, Dialog, Divider, H4, H5, Classes, Spinner, SpinnerSize } from "@blueprintjs/core"
import moment from "moment"
import ReactPaginate from 'react-paginate'
import '../../assets/styles/pagination.css'
import { useHistory } from "react-router-dom"

const ListAnggota = () => {
    const client = useClient()
    const [anggota, setAnggota] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(15)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")

    // delete
    const [open, setOpen] = useState(false)
    const [idUser, setIdUser] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [messageDelete, setMessageDelete] = useState('')

    const history = useHistory()

    const deleteAnggota = (id) => {
        setTimeout(async () => {
            const res = await axios.delete(url_api + '/anggota/remove/' + id)
            setMessageDelete(res.data.message)
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

    useEffect(() => {
        axios.get(url_api + `/anggota/list?search_query=${keyword}&page=${page}&limit=${limit}`)
        .then((res) => {
            setAnggota(res.data.result)
            setPage(res.data.page)
            setPages(res.data.totalPage)
            setRows(res.data.totalRows)
        })
    }, [page, keyword, limit])

    const changePage = ({selected}) => {
        setPage(selected)

        if(selected === 9){
            setMessage("Data tidak ditemukan")
        }else{
            setMessage("")
        }
    }

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setMessage("");
        setKeyword(query);
    }

    return(
        <>
            <Header 
               user={client.account} 
            />

            <Container sx={{marginTop: '2%'}}>

                <Card>
                    <H4>Data Anggota</H4>
                    <p>Data dibawah ini adalah data semua anggota yang telah mendaftar</p><Divider/>

                    <form onSubmit={searchData} style={{marginTop: '1%'}}>
                        <Flex sx={{justifyContent: 'space-between'}}>
                            <Box>
                                <Flex>
                                    <Box>
                                        <input
                                            type="text"
                                            className="bp4-input"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Cari disini..."
                                        />
                                    </Box>&nbsp;
                                    <Box>
                                        <div className="control">
                                            <button type="submit" className="bp4-button bp4-intent-primary">Cari</button>
                                        </div> 
                                    </Box>
                                </Flex>
                            </Box>
                            <Box>
                                <Select 
                                    data={[
                                        {name: 50}, 
                                        {name: 150}, 
                                        {name: 250},
                                        {name: 500},
                                    ]}
                                    handleChange={(e) => {
                                        setLimit(e.target.value)
                                    }}
                                    id="limit"
                                    name="limit"
                                />
                            </Box>
                        </Flex>
                        
                    </form>

                    <table style={{width: '100%'}} className="bp4-html-table bp4-html-table-striped bp4-html-table-bordered bp4-html-table-condensed">
                        <thead>
                        <tr>
                            <th>Nama Lengkap</th>
                            <th>NIM</th>
                            <th>Jurusan</th>
                            <th>Prodi</th>
                            <th>Tanggal Bergabung</th>
                            <th>Status</th>
                            <th>Opsi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {anggota.length > 0 ? // jika data ada
                            anggota.map((val, key) => (
                                <tr key={key}>
                                    <td>{val.fullname}</td>
                                    <td>{val.nim}</td>
                                    <td>{val.jurusan}</td>
                                    <td>{val.prodi}</td>
                                    <td>{moment(val.tgl_join).format('DD-MM-YYYY')}</td>
                                    <td>
                                        {val.verified === 'diterima' ? 
                                        <font color="green">Diterima</font> 
                                        : val.verified === 'ditolak' ?
                                        <font color="red">Ditolak</font>
                                        :<font color="red">Menunggu Diterima</font>}
                                    </td>
                                    <td>
                                        <Button intent="primary" small={true} onClick={() => {
                                            history.push('/anggota/' + val.idAnggota)
                                        }}>Detail</Button>&nbsp;

                                        <Button intent="danger" small={true} onClick={() => {
                                            setOpen(true)
                                            setIdUser(val.id_user)
                                        }}>Hapus</Button>
                                    </td>
                                </tr>
                            ))
                        : // jika data tidak ada
                            <tr>
                                <td colSpan={7} style={{textAlign: 'center'}}>Data yang dicari tidak ada</td>
                            </tr>
                        }
                        </tbody>
                    </table><Divider style={{marginBottom: '1%'}}/>

                    <p>Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}</p>                            
                    <p><font color="red">{message}</font></p><Divider/>

                    <nav className="pagination is-centered" key={rows} style={{marginTop: '1%'}}>
                        <ReactPaginate
                            previousLabel={"< Previous"}
                            nextLabel={"Next >"}
                            pageCount={Math.min(10, pages)}
                            onPageChange={changePage}
                            containerClassName={"pagination-list"}
                            pageLinkClassName={"pagination-link"}
                            previousLinkClassName={"pagination-previous"}
                            nextLinkClassName={"pagination-next"}
                            activeLinkClassName={"pagination-link is-current"}
                            disabledLinkClassName={"pagination-link is-disabled"}
                        />
                    </nav>

                </Card>

                <Dialog isOpen={open} title="Menghapus Anggota">
                    <div className={Classes.DIALOG_BODY}>
                        {messageDelete !== '' ? <><Alert intent={success ? "success" : "danger"} message={messageDelete} /><Divider /></> : null}

                        <H4 style={{textAlign: 'center'}}>Yakin ingin dihapus ?</H4>
                        <H5 style={{textAlign: 'center'}}>Data yang akan dihapus tidak dapat dikembalikan</H5><Divider />

                        <div className={Classes.DIALOG_FOOTER} style={{marginTop: '2%'}}>
                            <div className="bp4-dialog-footer-actions">
                                {loading ?
                                <Button style={{width: '10%'}} intent="primary" disabled><Spinner size={SpinnerSize.SMALL}/></Button>
                                : <Button intent="primary" onClick={() => deleteAnggota(idUser)}>Ya</Button> }

                                <Button intent="danger" onClick={() => setOpen(false)}>Tidak</Button>
                            </div>
                        </div>
                    </div>
                </Dialog>

            </Container>
        </>
    )
}

export default ListAnggota