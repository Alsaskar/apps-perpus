import { Card, Divider, H3 } from "@blueprintjs/core"

const CardBuku = ({judul, cover, penulis, penerbit, jumlah, deskripsi}) => {
    return(
        <>
            <Card>
                <center>
                    <img 
                        src={cover} 
                        alt="Cover Buku"
                        style={{
                            height: '200px',
                            maxWidth: '100%',
                        }} 
                    />
                </center><Divider />
                <H3 style={{textAlign: 'center'}}>{judul}</H3>

                <p>Penulis : {penulis}</p>
                <p>Penerbit : {penerbit}</p>
                <p>Jumlah : {jumlah}</p><Divider />

                <div style={{marginTop: '2%'}}>{deskripsi}</div>
            </Card>
        </>
    )
}

export default CardBuku