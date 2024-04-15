//------------------------------------------------api/drive-----------------------------------
// const apiDir = join(tmpdir, "");
// router.get('/api/drive', async (req, res) => {
//
//     try {
//         const files = await fs.readdir(apiDir);
//         const dataFiles = await Promise.all(files.map(async (fileName) => {
//             const fileInfo = await fs.stat(join(apiDir, fileName));
//             return {
//                 name: fileName,
//                 isFolder: fileInfo.isDirectory(),
//             };
//         }));
//         res.json(dataFiles);
//     } catch (error) {
//         console.error("Erreur lors de la lecture du répertoire :", error);
//         res.status(500).json({error: "Erreur lors de la lecture du répertoire"});
//     }
// })

//---------------------------------------Retourne le contenu de {name}--------------------------------------------------
// let data = [
//     {name: "Autre dossier", isFolder: true},
//     {name: "passeport", size: 1003, isFolder: false}
// ];
// router.get("/api/drive/:name", (req, res) => {
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