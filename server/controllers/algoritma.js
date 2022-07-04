const algoNilai = async (req, res) => {
    const nilai_skl = req.body.nilai_skl
    const minat_bakat = req.body.minat_bakat
    const nilai_prestasi = req.body.nilai_prestasi

    const hasil_skl = (nilai_skl * 30) / 100
    const hasil_minat_bakat = (minat_bakat * 20) / 100
    const hasil_nilai_prestasi = (nilai_prestasi * 50) / 100

    const total = hasil_skl + hasil_minat_bakat + hasil_nilai_prestasi

    return res.status(200).json({hasil: total})
}

module.exports = {algoNilai}