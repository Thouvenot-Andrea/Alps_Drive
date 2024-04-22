//---------------------------------------Retourne le contenu de {name}--------------------------------------------------
// let data = [
//     {name: "Autre dossier", isFolder: true},
//     {name: "passeport", size: 1003, isFolder: false}
// ];
// router.get("/route.bis/drive/:name", (req, res) => {
//     const name = req.params.name;
//     const item = fileInfo.find(item => item.name === name);
//
//     if (item) {
//         if (item.isFolder) {
//             res.status(200).json(item);
//         } else {
//             res.status(200).json(item)
//             // .type('application/octet-stream')
//             // .send(`Contenu du fichier ${item.name}`);
//         }
//     } else {
//         res.status(404).send("Fichier ou dossier non trouvé");
//     }
// });