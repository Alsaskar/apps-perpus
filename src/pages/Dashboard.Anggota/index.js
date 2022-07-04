import { useState, useEffect } from "react"
import { useClient, Header } from "../../components"
import { H3, Divider } from "@blueprintjs/core"
import CardBuku from "./CardBuku"
import axios from "axios"
import { url_api } from "../../config"
import { Box, Flex, Select } from "../../components"
import ReactPaginate from "react-paginate"

const AnggotaDashboard = () => {
    const client = useClient()
    const [account, setAccount] = useState([])

    const [buku, setBuku] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(12)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        client.account.then((value) => {
            setAccount(value)
        })

        const fetch = async () => {
            const res = await axios.get(url_api + `/buku/list?search_query=${keyword}&page=${page}&limit=${limit}`)
            setBuku(res.data.result)
            setPage(res.data.page)
            setPages(res.data.totalPage)
            setRows(res.data.totalRows)
        }

        fetch()
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
            <Header 
               user={account} 
            />
            
            <div className="container" style={{marginTop: '2%'}}>
                <H3>Selamat datang, {account.fullname}</H3>
                <p>Silahkan mencari buku yang terdapat pada perpustakaan. Jika ada, pergi ke perpustakaan dan meminjammnya pada admin perpustakaan</p><Divider />

                <form onSubmit={searchData}>
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

                {buku.length > 0 ?
                    <div className="row">
                        {buku.map((val) => {
                            return(
                                <>
                                    <div className="col-md-4">
                                        <CardBuku
                                            judul={val.judul}
                                            cover={url_api + '/images/cover_buku/' + val.foto_cover}
                                            penulis={val.penulis}
                                            penerbit={val.penerbit}
                                            jumlah={val.jumlah}
                                            deskripsi={val.deskripsi}
                                        />
                                    <br/></div>
                                </>
                            )
                        })}
                    </div>
                : <>
                    <H3 style={{textAlign: 'center'}}>Tidak Ditemukan</H3>
                    <p align="center">Buku yang Anda cari tidak ada pada perpustakaan. Silahkan cari buku lain</p>
                </>}

                <p>Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}</p>                            
                <p><font color="red">{message}</font></p><Divider/>

                <nav className="pagination is-centered" key={rows} style={{marginTop: '1%', marginBottom: '2%'}}>
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
            </div>
        </>
    )
}

export default AnggotaDashboard