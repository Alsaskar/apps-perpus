import { Button, Card, Divider, H3 } from "@blueprintjs/core"
import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { Header, Container, useClient, Box, Flex, Select } from "../../components"
import { url_api } from "../../config"
import '../../assets/styles/pagination.css'
import ReactPaginate from 'react-paginate'

import DialogAdd from './Dialog.Add'
import DialogDelete from "./Dialog.Delete"
import DialogDetail from "./Dialog.Detail"
import DialogEdit from "./Dialog.Edit"

const ListBuku = () => {
    const client = useClient()

    // Open Dialog
    const [open, setOpen] = useState(false) // show add dialog
    const [openDelete, setOpenDelete] = useState(false) // show delete dialog
    const [openDetail, setOpenDetail] = useState(false) // show detail dialog
    const [openEdit, setOpenEdit] = useState(false) // show edit dialog

    const [buku, setBuku] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(15)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")

    const [idBuku, setIdBuku] = useState()
    const [judulBuku, setJudulBuku] = useState('')

    const [detailBuku, setDetailBuku] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(url_api + `/buku/list?search_query=${keyword}&page=${page}&limit=${limit}`)
            setBuku(res.data.result)
            setPage(res.data.page)
            setPages(res.data.totalPage)
            setRows(res.data.totalRows)
        }

        fetch()
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
            <Helmet>
                <title>Data Buku</title>
            </Helmet>

            <Header 
               user={client.account} 
            />

            {/* Tambahkan Buku - Dialog */}
            <DialogAdd
                isOpen={open}
                onClose={() => setOpen(false)}
            />

            {/* Hapus Buku - Dialog */}
            <DialogDelete
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                id={idBuku}
                judulBuku={judulBuku}
            />

            {/* Hapus Buku - Dialog */}
            <DialogEdit
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                buku={detailBuku}
            />

            {/* Detail Buku - Dialog */}
            <DialogDetail
                isOpen={openDetail}
                onClose={() => setOpenDetail(false)}
                buku={detailBuku}
            />

            <Container sx={{marginTop: '2%'}}>
                <Card>
                    <H3>Data Buku</H3>
                    <p>Dibawah ini adalah semua data buku yang telah di input</p><Divider />
                    
                    <Button intent="primary" onClick={() => setOpen(true)}>Tambah Buku</Button><Divider />

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
                            <th>Judul</th>
                            <th>Penulis</th>
                            <th>Penerbit</th>
                            <th>Jumlah</th>
                            <th>Opsi</th>
                        </tr>
                        </thead>
                        <tbody>
                            {buku.length > 0 ?
                                buku.map((val, key) => {
                                    return <tr key={key}>
                                        <td>{val.judul}</td>
                                        <td>{val.penulis}</td>
                                        <td>{val.penerbit}</td>
                                        <td>{val.jumlah}</td>
                                        <td>
                                            <Button intent="success" small={true} onClick={() => {
                                                setOpenDetail(true)

                                                const detail = { // detail data buku by id buku
                                                    judul: val.judul,
                                                    penulis: val.penulis,
                                                    penerbit: val.penerbit,
                                                    jumlah: val.jumlah,
                                                    foto_cover: val.foto_cover,
                                                    deskripsi: val.deskripsi
                                                }

                                                setDetailBuku(detail)
                                            }}>Detail</Button>&nbsp;

                                            <Button intent="primary" small={true} onClick={() => {
                                                setOpenEdit(true)

                                                const detail = { // detail data buku by id buku
                                                    id: val.id,
                                                    judul: val.judul,
                                                    penulis: val.penulis,
                                                    penerbit: val.penerbit,
                                                    jumlah: val.jumlah,
                                                    foto_cover: val.foto_cover,
                                                    deskripsi: val.deskripsi
                                                }

                                                setDetailBuku(detail)
                                            }}>Edit</Button>&nbsp;

                                            <Button intent="danger" small={true} onClick={() => {
                                                setOpenDelete(true)
                                                setIdBuku(val.id)
                                                setJudulBuku(val.judul)
                                            }}>Hapus</Button>
                                        </td>
                                    </tr>
                                })
                            :
                            <tr>
                                <td colSpan={5} style={{textAlign: 'center'}}>Data yang dicari tidak ada</td>
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
            </Container>
        </>
    )
}

export default ListBuku