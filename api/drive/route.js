const express = require('express');
const router = express.Router();
const {promises: fs} = require("fs");
const os = require("os");
const {join} = require("path");


router.get("/", (req, res) => {
    res.json({message: "Got it!"})
})


//------------------------------------------------api/drive-----------------------------------
// const tmpdir = os.tmpdir();
// const apiDir = join(tmpdir, "");
// router.get('/api/drive', async (req, res) => {
//
//     try {
//         const files = await fs.readdir(apiDir);
//         const dataFiles = await Promise.all(files.map(async (fileName) => {
//             const fileInfo = await fs.stat(join(apiDir, fileName));
//             return {
//
//
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
// ;


// ---------------Retourne une liste contenant les dossiers et fichiers à la racine du “drive”---------------------------

// router.get("/api/drive/", (req, res) => {
//     const data = [
//         { name: "Personnel", isFolder: true },
//         { name: "avis imposition", size: 1337, isFolder: true }
//     ];
//     // Retourne la liste au format JSON
//     res.status(200).json(data);
// });

//---------------------------------------Retourne le contenu de {name}--------------------------------------------------


let data = [
    {name: "Autre dossier", isFolder: true},
    {name: "passeport", size: 1003, isFolder: false}
];

router.get("/api/drive/", (req, res) => {
    res.status(200).json(data);
});

router.get("/api/drive/:name", (req, res) => {
    const name = req.params.name;
    const item = data.find(item => item.name === name);

    if (item) {
        if (item.isFolder) {
            res.status(200).json(item);
        } else {
            res.status(200).json(item)
            // .type('application/octet-stream')
            // .send(`Contenu du fichier ${item.name}`);
        }
    } else {
        res.status(404).send("Fichier ou dossier non trouvé");
    }
});

//-------------------------------------------------Créer un dossier avec le nom {name}---------------------------------------------------------------------
router.post("/api/drive?", (req, res) => {

try{
    fs.mkdir()
}
catch{
    console.log("error creating drive");
}
})

// Exporte le routeur
module.exports = router;
