function start() {

    const {promises: fs} = require("fs");
    const express = require('express');
    const app = express();
    const morgan = require('morgan');

    app.listen(3000, () => {
        console.log('Serveur démarré sur le port 3000');
    });

    /*configurer notre API, pour informer les navigateurs qu'elle peut être consommée depuis n’importe quelle origine.*/
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });

//test.js-------------------------------------------------------
//         const users = require("./routes/test")
//         app.use("/users", users)
// x.js-----------------------------------------------------------
//         const nom = require("./routes/x")
//         app.use("/nom", nom)
//route.js---------------------------------------------------------------------
    const route = require("./api/drive/route");
    app.use("", route)

}

module.exports = start;




