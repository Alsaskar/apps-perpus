import { useMemo } from "react";
import { Navigation } from "../Root/hoc";
import { Helmet } from "react-helmet";
import { useRouteMatch } from "react-router-dom"
import Router from "./Router";
import ListAnggota from "../Anggota.List";

const Anggota = () => {
    const { path } = useRouteMatch();
    const navigation = useMemo(() => ([
        {
            "component": ListAnggota,
            "path": `/`,
            "hide": true,
            "exact": true
        }
    ]), []);

    return(
        <>
            <Helmet>
                <title>Data Anggota</title>
            </Helmet>
            <Navigation base={path} navigation={navigation}>
                <Router />
            </Navigation>
        </>
    )
}

export default Anggota