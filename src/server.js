const express = require('express');
const app = express();
const {promises: fs} = require("fs");
const morgan = require('morgan');
const path = require('path');
const os = require("os");
const tmpdir = path.join(os.tmpdir(), "/");
const busboy = require("express-busboy");
const {join} = require("path");

busboy.extend(app,{
    upload:true,
    path:tmpdir
})

function start() {

    app.listen(3000, () => {
        console.log('Serveur démarré sur le port 3000');
    });

    /*configurer notre API, pour informer les navigateurs qu'elle peut être consommée depuis n’importe quelle origine.*/
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        // autorise toutes les origines (sites web) à accéder aux ressources de mon serveur
        res.header('Access-Control-Allow-Methods', '*');
        // permet à toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc) à accéder aux ressources de mon serveur
        res.header('Access-Control-Allow-Headers', '*');
        // autorise tous les en-têtes HTTP dans la requête. Elles sont utilisés pour transmettre des infos supplémentaires entre le client et le serveur
        next();
    });

//test.js-------------------------------------------------------
//         const users = require("./routes/test")
//         app.use("/users", users)
// x.js-----------------------------------------------------------
//         const nom = require("./routes/x")
//         app.use("/nom", nom)
//route.js---------------------------------------------------------------------
    const route = require("./route");
    app.use("", route)

}

module.exports = start;




