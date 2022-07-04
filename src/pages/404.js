import NotFound from '../assets/images/notfound.png'
import { Container, Flex, Box } from '../components'
import { H3, H4, Button, Divider } from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'

const FourOFour = () => {
    const history = useHistory()

    return(
        <>
            <Container style={{marginTop: '4%'}}>
                <center><img src={NotFound} alt="Notfound" style={{height: '300px'}}/></center>
                <H3 style={{textAlign: 'center'}}>Halaman Tidak Ditemukan</H3>
                <H4 style={{textAlign: 'center'}}>Halaman yang dituju tidak dapat ditemukan. Silahkan kembali</H4><Divider />

                <Flex sx={{justifyContent: 'center'}}>
                    <Box>
                        <Button intent='danger' onClick={() => {
                            history.push('/')
                        }}>Kembali</Button>
                    </Box>
                </Flex>
            </Container>
        </>
    )
}

export default FourOFour