import { useRouteMatch } from "react-router-dom"
import { useMemo } from "react"
import { useClient } from "../../components";
import Helmet from "react-helmet";
import { Navigation, RootProvider } from "./hoc";
import Router from "./Router";

import AdminDashboard from "../Dashboard.Admin";
import AnggotaDashboard from "../Dashboard.Anggota";
import Profil from "../Profil";
import Anggota from "../Anggota";
import DetailAnggota from '../Anggota.Details'
import ListBuku from "../Buku.List";
import PinjamBuku from "../Buku.Pinjam";
import DataPinjamBuku from "../Buku.Data.Pinjam";
import DataPengembalian from "../Buku.Data.Pengembalian";
import AdminDataPengembalian from "../Buku.Data.Pengembalian.Admin";

const navigation = [
    {
        "title": "Admin Dashboard",
        "text": "Admin Dashboard",
        "component": AdminDashboard,
        "path": "/admin",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
    {
        "title": "Anggota Dashboard",
        "text": "Anggota Dashboard",
        "component": AnggotaDashboard,
        "path": "/anggota",
        "icon": "blank",
        "exact": true,
        "permission": "anggota"
    },
    {
        "title": "Profil",
        "text": "Profil",
        "component": Profil,
        "path": "/profil",
        "icon": "blank",
        "exact": true,
        "permission": "anggota"
    },
    {
        "title": "Data Anggota",
        "text": "Data Anggota",
        "component": Anggota,
        "path": "/anggota",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
    {
        "title": "Detail Anggota",
        "text": "Detail Anggota",
        "component": DetailAnggota,
        "path": "/anggota/:id_anggota",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
    {
        "title": "Data Buku",
        "text": "Data Buku",
        "component": ListBuku,
        "path": "/buku",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
    {
        "title": "Pinjam Buku",
        "text": "Pinjam Buku",
        "component": PinjamBuku,
        "path": "/meminjam-buku",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
    {
        "title": "Data Pinjam Buku",
        "text": "Data Pinjam Buku",
        "component": DataPinjamBuku,
        "path": "/pinjam-buku",
        "icon": "blank",
        "exact": true,
        "permission": "anggota"
    },
    {
        "title": "Data Pengembalian Buku",
        "text": "Data Pengembalian Buku",
        "component": DataPengembalian,
        "path": "/pengembalian-buku",
        "icon": "blank",
        "exact": true,
        "permission": "anggota"
    },
    {
        "title": "Data Pengembalian Buku",
        "text": "Data Pengembalian Buku",
        "component": AdminDataPengembalian,
        "path": "/pengembalian-buku",
        "icon": "blank",
        "exact": true,
        "permission": "admin"
    },
]

const Main = () => {
    const {path} = useRouteMatch()
    const client = useClient();

    const items = useMemo(() => {
        return navigation.filter(({ permission }) => {
            return permission ? permission === client.role : true;
        });
    }, [client.role])

    return(
        <RootProvider>
            <Helmet>
                <title>Dashboard - Perpustakaan Polimdo</title>
            </Helmet>
            <Navigation base={path} navigation={items}>
                <Router />
            </Navigation>
        </RootProvider>
    )
}

export default Main