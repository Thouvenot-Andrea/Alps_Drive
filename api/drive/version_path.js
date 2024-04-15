//--------------------------------------------------version :path(*)---------------------------------------------------
// Route pour obtenir le contenu d'un dossier ou d'un fichier
// router.get("/api/drive/:path(*)", async (req, res) => {
//     const requestedPath = req.params.path || "";
//     const filePath = path.join(tmpdir, requestedPath);
//
//     try {
//         const fileInfo = await fs.stat(filePath);
//         if (fileInfo.isDirectory()) {
//             const files = await fs.readdir(filePath);
//             const dataFiles = await Promise.all(files.map(async fileName => {
//                 const subFilePath = path.join(filePath, fileName);
//                 const subFileInfo = await fs.stat(subFilePath);
//                 return {
//                     name: fileName,
//                     isFolder: subFileInfo.isDirectory(),
//                     size: subFileInfo.size
//                 };
//             }));
//             res.status(200).json(dataFiles);
//         } else {
//             const fileStream = fs.createReadStream(filePath);
//             res.set('Content-Type', 'application/octet-stream');
//             fileStream.pipe(res);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(404).send("Erreur lors de la récupération du fichier ou du dossier.");
//     }
// });
// router.post("/api/drive/:path(*)", async (req, res) => {
//     const requestedPath = req.params.path || "";
//     const { name } = req.query;
//     const folderPath = path.join(tmpdir, requestedPath, name);
//
//     if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
//         return res.status(400).send("Le nom du dossier n'est pas correct, il doit contenir uniquement des caractères alphanumériques.");
//     }
//
//     try {
//         await fs.mkdir(folderPath, { recursive: true });
//         res.sendStatus(201);
//     } catch (error) {
//         res.status(500).send(`Impossible de créer le dossier: ${error}`);
//     }
// });

// -------------------------------------------------version simplifier path---------------------------------------------
// router.get('/api/drive/:path(*)?', async (req, res) => {
//     const requestedPath = req.params.path || ""; // Si aucun chemin n'est fourni, utilisez une chaîne vide
//     const filePath = path.join(tmpdir, requestedPath);
//
//     try {
//         const fileInfo = await fs.stat(filePath);
//         if (fileInfo.isDirectory()) {
//             const files = await fs.readdir(filePath);
//             const dataFiles = await Promise.all(files.map(async fileName => {
//                 const subFilePath = path.join(filePath, fileName);
//                 const subFileInfo = await fs.stat(subFilePath);
//                 return {
//                     name: fileName,
//                     isFolder: subFileInfo.isDirectory(),
//                     size: subFileInfo.size
//                 };
//             }));
//             res.status(200).json(dataFiles);
//         } else {
//             const fileStream = fs.createReadStream(filePath);
//             res.set('Content-Type', 'application/octet-stream');
//             fileStream.pipe(res);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(404).send("Erreur lors de la récupération du fichier ou du dossier.");
//     }
// });
// router.post("/api/drive/:path(*)", async (req, res) => {
//     const requestedPath = req.params.path || "";
//     const { name } = req.query;
//     const folderPath = path.join(tmpdir, requestedPath, name);
//
//     if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
//         return res.status(400).send("Le nom du dossier n'est pas correct, il doit contenir uniquement des caractères alphanumériques.");
//     }
//
//     try {
//         await fs.mkdir(folderPath, { recursive: true });
//         res.sendStatus(201);
//     } catch (error) {
//         res.status(500).send(`Impossible de créer le dossier: ${error}`);
//     }
// });
