function start() {
    const express = require('express');
    const port = process.env.PORT || 3000;

    const app = express();

// si on veu afficher une info sur la page
    app.get("/", (req, res) => {
        res.send("Got it!")
    })

    app.listen(port, () => {
        console.log("Serveur est en ligne")
    })

    /*configurer notre API, pour informer les navigateurs qu'elle peut être consommée
    depuis n’importe quelle origine.*/
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    });
}

module.exports = start;