import { useMemo } from "react";
import { Navigation } from "../Root/hoc";
import { Helmet } from "react-helmet";
import { useRouteMatch } from "react-router-dom"
import ProfilAnggota from "../Profil.Anggota";
import Router from "./Router";

const Profil = () => {
    const { path } = useRouteMatch();
    const navigation = useMemo(() => ([
        {
            "component": ProfilAnggota,
            "path": `/`,
            "hide": true,
            "exact": true
        },
    ]), []);

    return(
        <>
            <Helmet>
                <title>Profil - Perpustakaan Polimdo</title>
            </Helmet>
            <Navigation base={path} navigation={navigation}>
                <Router />
            </Navigation>
        </>
    )
}

export default Profil