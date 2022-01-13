// Sisällytetään mongoosen ominaisuudet, eli käytännössä mongoDB-toiminnallisuus
const mongoose = require('mongoose')
// Muodostetaan schema ryhmälle, tämä on käytännössä taulu SQL-tietokannassa
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25
    },
    admin: {
        type: String,
        required: true
    },
    groupKey: {
        type: String,
        required: true,
        unique: true
    },
    locked: {
        type: Boolean,
        default: false
    },
    members: [{
        memberName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20
        },
        burgers: {
            type: Number,
            default: 0,
            min: 0
        },
        smallCans: {
            type: Number,
            default: 0,
            min: 0
        },
        bigCans: {
            type: Number,
            default: 0,
            min: 0
        }
    }]
})
// Luodun modelin(=taulun) jakaminen sovelluksen käyttöön, taulun nimeksi tulee 'Group'
module.exports = mongoose.model('Group', groupSchema)

