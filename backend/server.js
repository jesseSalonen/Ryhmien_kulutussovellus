// Haetaan ympäristömuuttuja .env-tiedostosta vain siinä tapauksessa,
// jos sovellus ajetaan kehitystilassa (npm run devStart, ei npm run start)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Sisällytä kaikki asennetut paketit
const express = require('express')

// Käynnistä express sovellus, sisällytä se muuttujaan app
const app = express()

// Parseri JSON-objetkeille
app.use(express.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

// Hae eri endpointeille tehdyt routerit muuttujiin
const indexRouter = require('./routes/index')
const groupRouter = require('./routes/groups')

// Sisällytä mongoose-paketti, joka mahdollistaa mongoDB-tietokannan yhdistämisen
const mongoose = require('mongoose')
// Yhdistä mongoDB-tietokantaan, URL saadaan .env-tiedostosta
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
// Hallitse tietokantayhteyttä db-muuttujan takaa
const db = mongoose.connection
// Tulosta ilmoitukset virheestä tai yhdistämisestä konsoliin
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Käske sovellusta käyttämään aikaisemmin haettuja routereita tietyissä endpointeissa
app.use('/', indexRouter)
// Kirjailijoiden routerit eivät tarvitse eteensä aina /authors-polkua, koska tässä se lisätään oletuksena
app.use('/groups', groupRouter)



// Määritetään portti, jota sovellus kuuntelee. Joko palvelimen määrittämä, tai oletuksena 3000
const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Listening on port ${port}...`))

