import { Container, Header, useClient, Flex, Box, Select } from "../../components"
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import { url_api } from "../../config"
import axios from 'axios'
import { Card, H3, Divider } from "@blueprintjs/core"
import ReactPaginate from "react-paginate"
import moment from "moment"

const DataPengembalian = () => {
    const client = useClient()
    const [account, setAccount] = useState([])

    const [list, setList] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(15)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        client.account.then(async (value) => {
            setAccount(value)

            const res = await axios.get(`${url_api}/pengembalian-buku/list/${value.anggota.result[0].id}?search_query=${keyword}&page=${page}&limit=${limit}`)
            setList(res.data.result)
            setPage(res.data.page)
            setPages(res.data.totalPage)
            setRows(res.data.totalRows)
        })
    }, [client, page, keyword, limit])

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
                <title>Buku Yang Dikembalikan</title>
            </Helmet>

            <Header 
                user={account} 
            />

            <Container style={{marginTop: '3%'}}>
                <Card>
                    <H3>Data Pengembalian</H3>
                    <p>Buku yang telah Anda kembalikan</p><Divider />

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
                            <th>Judul Buku</th>
                            <th>Tanggal Dikembalikan</th>
                            <th>Harga Denda</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ?
                                list.map((val, key) => {
                                    return <tr key={key}>
                                        <td>{val.judul}</td>
                                        <td>{moment(val.tgl_dikembalikan).format("DD-MM-YYYY")}</td>
                                        <td>{val.total_harga_denda}</td>
                                        <td>{val.status === 'kena denda' ? <font color="red">Kena Denda</font> : <font color="green">Tidak kena denda</font> }</td>
                                    </tr>
                                })
                            :
                            <tr>
                                <td colSpan={5} style={{textAlign: 'center'}}>Tidak ada data</td>
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

export default DataPengembalian