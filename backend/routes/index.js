/*
routes = controllers:
hoitavat clienteiltä tulevat pyynnöt eteenpäin
toimivat välikäsinä modelssien ja viewien välillä
*/

// Haetaan express käyttöön
const express = require('express')
// Haetaan expressin router-ominaisuus tähän käyttöön
const router = express.Router()

// Rakennetaan router GET-prosessille, joka siis hakee halutun viewin clientille, kun tämä avaa root endpointin '/'
router.get('/', (req, res) => {
    res.send("Etusivu")
})

// jaetaan router sovelluksen käyttöön, tätä kutsutaan server.js -tiedostossa, eli 'sovellustiedostossa'
module.exports = router