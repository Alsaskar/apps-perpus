import { 
    Navbar, 
    Button, 
    Alignment, 
    Popover, 
    Drawer, 
    DrawerSize, 
    Divider, 
    H3,
    Menu,
    MenuItem,
    MenuDivider,
} from '@blueprintjs/core'
import { useState } from 'react'
import { Container } from './Container'
import { Box } from './Grid'
import imgUser from '../assets/images/img-user.png'
import { useClient } from './client'
import { useHistory } from 'react-router-dom'

export const Header = ({user}) => {
    const [isOpen, setIsOpen] = useState(false)
    const client = useClient()
    const history = useHistory()

    const ContentPopover = () => {
        return(
            <Box sx={{p: 2, width: "100%"}}>
                {user.role === 'anggota' ? <><Button className="bp4-minimal" icon="user" text="Profil" onClick={() => history.push('/profil')} /><br/></> : null}
                
                <Button className="bp4-minimal" icon="log-out" text="Keluar" onClick={() => client.logout()} />
            </Box>
        )
    }

    return(
        <>
            <Navbar className='bp4-dark'>
                <Container>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>Perpustakaan Polimdo</Navbar.Heading>
                        <Navbar.Divider />

                        <Button onClick={() => setIsOpen(true)} className="bp4-minimal" icon="menu-open" />
                    </Navbar.Group>

                    <Navbar.Group align={Alignment.RIGHT}>
                        <Popover content={<ContentPopover/>} target={<Button text={user.fullname} icon="user" />} />
                    </Navbar.Group>
                </Container>
            </Navbar>

            {/* Drawer - Sidebar Left */}
            <Drawer
                isOpen={isOpen}
                size={DrawerSize.SMALL}
                position={Alignment.LEFT}
                onClose={() => {
                    setIsOpen(false)
                }}
                style={{backgroundColor: "#1c2127"}}
            >
                <Box sx={{p: 3}}>
                    {/* Profil User */}
                    <Box className='profil-user'>
                        <center><img src={imgUser} alt="User" style={{height: "100px"}} /></center>
                        <H3 style={{color: 'white', marginTop: 5, textAlign: 'center'}}>{user.fullname}</H3>
                        <p style={{color: 'white', textAlign: 'center'}}>Anda login sebagai {user.role}</p>
                    </Box><Divider />

                    <Box>
                        <Menu style={{backgroundColor: '#1c2127', color: 'white'}}>
                            <MenuItem icon="dashboard" text="Dashboard" onClick={() => {
                                history.push('/' + user.role)
                            }} /><MenuDivider />

                            {user.role === 'admin' ? 
                                <>
                                    <MenuItem icon="book" text="Data Buku" onClick={() => {
                                        history.push('/buku')
                                    }} /><MenuDivider />
                                    <MenuItem icon="user" text="Data Anggota" onClick={() => {
                                        history.push('/anggota')
                                    }} /><MenuDivider />
                                    <MenuItem icon="book" text="Meminjam Buku" onClick={() => {
                                        history.push('/meminjam-buku')
                                    }} /><MenuDivider />
                                    <MenuItem icon="book" text="Data Pengembalian Buku" onClick={() => {
                                        history.push('/pengembalian-buku')
                                    }} />
                                </>
                            : user.role === 'anggota' ?
                                <>
                                    <MenuItem icon="book" text="Data Pinjam Buku" onClick={() => {
                                        history.push('/pinjam-buku')
                                    }} /><MenuDivider />
                                    <MenuItem icon="book" text="Data Pengembalian Buku" onClick={() => {
                                        history.push('/pengembalian-buku')
                                    }} /><MenuDivider />
                                </>
                            : null}
                        </Menu>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}