const startServer = require("./server.js")


startServer()



// router.post("/api/drive/", (req, res) => {
//     const name = req.query.name;
//
//     if (!name || !name.match(/^[a-zA-Z0-9]+$/)) {
//         res.status(400).send("Le nom du dossier doit contenir uniquement des caractères alphanumériques.");
//     } else {
//         const existingItem = data.find(item => item.name === name);
//         if (existingItem) {
//             res.status(409).send("Le dossier existe déjà.");
//         } else {
//             // Ajouter le dossier au répertoire "/api/drive/"
//             data.push({name: name, isFolder: true});
//             res.status(201).send("Dossier créé avec succès.");
//         }
//     }
// });
