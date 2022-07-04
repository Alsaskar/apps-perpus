import { Card, Divider, H3, Button } from "@blueprintjs/core"
import { useState } from "react"
import { Container } from "../../components"
import List from "./List"
import DialogAdd from "./Dialog.Add"

const Layout = () => {

    // Open Dialog
    const [openAdd, setOpenAdd] = useState(false)

    return(
        <>
            {/* Tambahkan Buku - Dialog */}
            <DialogAdd
                isOpen={openAdd}
                onClose={() => setOpenAdd(false)}
            />

            <Container style={{marginTop: '2%'}}>
                <Card>
                    <H3>Peminjam Buku</H3>
                    <p>Dibawah ini adalah data peminjam buku</p><Divider />

                    <Button intent="primary" onClick={() => setOpenAdd(true)}>Tambah Peminjam</Button><Divider />

                    {/* List Data Peminjam Buku */}
                    <List />

                </Card>
            </Container>
        </>
    )
}

export default Layout