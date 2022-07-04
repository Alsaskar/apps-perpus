import { useEffect, useState } from "react"
import '../../assets/styles/pagination.css'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import { url_api } from "../../config"
import { Flex, Box, Select } from "../../components"
import { Button, Divider } from "@blueprintjs/core"
import moment from "moment"
import DialogPengembalian from "./Dialog.Pengembalian"
import DialogReminder from "./Dialog.Reminder"

const List = () => {
    const [peminjam, setPeminjam] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(15)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")

    // Open Dialog Pengembalian
    const [openPengembalian, setOpenPengembalian] = useState(false)
    const [dataPeminjam, setDataPeminjam] = useState([])

    const [openReminder, setOpenReminder] = useState(false)
    const [dataReminder, setDataReminder] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(url_api + `/pinjam-buku/list?search_query=${keyword}&page=${page}&limit=${limit}`)
            setPeminjam(res.data.result)
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
            {/* Tambahkan Buku - Dialog */}
            <DialogPengembalian
                isOpen={openPengembalian}
                onClose={() => setOpenPengembalian(false)}
                data={dataPeminjam}
            />

            {/* Reminder - Ingatkan kepada anggota untuk kembalikan buku - SMS Gateway */}
            <DialogReminder
                isOpen={openReminder}
                onClose={() => setOpenReminder(false)}
                data={dataReminder}
            />

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
                    <th>Nama Peminjam</th>
                    <th>NIM Peminjam</th>
                    <th>Judul Buku</th>
                    <th>Tanggal Peminjaman</th>
                    <th>Tanggal Pengembalian</th>
                    <th>Waktu Pengembalian</th>
                    <th>Status</th>
                    <th>Opsi</th>
                </tr>
                </thead>
                <tbody>
                    {peminjam.length > 0 ?
                        peminjam.map((val, key) => {
                            return <tr key={key}>
                                <td>{val.fullname}</td>
                                <td>{val.nim}</td>
                                <td>{val.judul}</td>
                                <td>{moment(val.tgl_pinjam).format('DD-MM-YYYY')}</td>
                                <td>{moment(val.tgl_pengembalian).format('DD-MM-YYYY')}</td>
                                <td>
                                    {moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') > 0 ? 
                                        val.status === 'sudah dikembalikan' ? '-' : moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') + ' hari lagi'
                                    : moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 0 ? val.status === 'sudah dikembalikan' ? '-' : "Hari ini"
                                    : val.status === 'sudah dikembalikan' ? '-' : <font color="red">Sudah lewat</font>}
                                </td>
                                <td>{
                                    val.status === 'sudah dikembalikan' ? <font color="green">Sudah Dikembalikan</font> :
                                    <font color="red">Belum Dikembalikan</font>}
                                </td>
                                <td>
                                    {val.status === 'sudah dikembalikan' ? '-' 
                                    :
                                    <>
                                        <Button intent="primary" onClick={() => {
                                            setOpenPengembalian(true)
                                            setDataPeminjam(val)
                                        }}>Kembalikan</Button>

                                        {moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 3 || moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 2 || moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 1 || moment(val.tgl_pengembalian).diff(moment().format("YYYY-MM-DD"), 'days') === 0 ? 
                                            
                                            <Button intent="success" onClick={() => {
                                                setOpenReminder(true)
                                                setDataReminder(val)
                                            }}>Ingatkan</Button>
                                            
                                        : null}
                                    </>
                                    }
                                </td>
                            </tr>
                        })
                    :
                    <tr>
                        <td colSpan={8} style={{textAlign: 'center'}}>Tidak ada data</td>
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
        </>
    )
}

export default List