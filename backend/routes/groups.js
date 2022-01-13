/*
routes = controllers:
hoitavat clienteiltä tulevat pyynnöt eteenpäin
toimivat välikäsinä modelssien ja viewien välillä
*/

// Haetaan express käyttöön
const express = require('express')
// Haetaan expressin router-ominaisuus tähän käyttöön
const router = express.Router()
// Haetaan ryhmän 'taulu' tietokannan käyttöön
const Group = require('../models/group')
Group.syncIndexes()
const makeid = require('../public/functions')

// Kaikkien ryhmien hakemiseen tarkoitettu route
router.get('/', async (req, res) => {
    // Lisää tänne kaikki haulla löydetyt ryhmät
    try {
        // Yritä hakea kaikki ryhmät tietokannasta
        const groups = await Group.find().select('groupName admin groupKey locked members')
        if (groups.length > 0) {
            res.status(200).json(groups)
        }
        else {
            res.status(404).json({
                message: 'No entries found'
            })
        }
    } catch(err) {
        // Jos ei onnistu, lähetä virhe
        res.status(500).json({ message: err })
    }
    
})

// Hakee ryhmiä ryhmäkoodin perusteella
router.get('/:key', async (req, res) => {
    try {
        const group = await Group.find({groupKey: req.params.key}).select('groupName admin groupKey locked members')
        if (group.length > 0) {
            //res.status(404).send('Tällä koodilla ei löytynyt ryhmiä!')
            res.status(200).json(group)
        }
        else {
            res.status(404).json({
                message: "No valid entry found for given key"
            })
        }
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

// Uuden ryhmän luomiseen tarkoitettu route
router.post('/', async (req, res) => {
    let existingGroups
    let generatedKey = '0'

    // Luodaan uutta koodia ryhmälle niin kauan, kunnes uniikki löytyy
    try {
        existingGroups = await Group.find()
    }catch (err) {
        return res.status(500).json({ message: err })
    }
    while (generatedKey == '0') {
        generatedKey = makeid(5)
        for (let i = 0; i < existingGroups.length; i++) {
            if (existingGroups[i].groupKey == generatedKey) {
                generatedKey == '0';
                break;
            }
        }
    }
    const group = new Group({
        // Tässä asetetaan arvot http-kutsusta suoraan uuteen ryhmä-schemaan
        groupName: req.body.groupName,
        admin: req.body.memberName,
        groupKey: generatedKey,
        members: [{
            memberName: req.body.memberName
        }]
    })

    try {
        // Yritä tallentaa uutta ryhmää tietokantaan
        const savedGroup = await group.save()
        res.status(201).json({
            groupName: savedGroup.groupName,
            admin: savedGroup.admin,
            groupKey: savedGroup.groupKey,
            locked: savedGroup.locked,
            members: savedGroup.members
        })
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

// Muuttaa ryhmän tietoja
router.patch('/:key', async (req, res) => {
    // Muuta ryhmän lukituksen tila
    if (req.body.locked) {
        try {
            const updatedGroup = await Group.updateOne(
                { groupKey: req.params.key },
                { $set: req.body}
            )
            return res.status(200).json(updatedGroup)
    
        } catch (err) {
            return res.status(400).json({ message: err })
        }
    }
    // Lisää uusi jäsen ryhmään
    else if (req.body.memberName) {
        let group
        // Tarkista, onko ryhmää annetulla koodilla
        try {
            group = await Group.find({groupKey: req.params.key})
        }catch (err) {
            return res.status(500).json({ message: err })
        }
        if (group.length > 0) {
            if (group[0].members.some(e => e.memberName === req.body.memberName)) {
                return res.status(400).json({
                    message: "Member with given name already exists"
                })
            }
            else if (group[0].locked === true) {
                return res.status(400).json({
                    message: "The group is locked"
                })
            }
        }
        else {
            return res.status(404).json({
                message: "No valid entry found for given key"
            })
        }
        // Jos arvot lisääminen ok, yritä suorittaa
        try {
            const updatedGroup = await Group.updateOne(
                { groupKey: req.params.key },
                { $push: { members: req.body }}
            )
            res.status(200).json(updatedGroup)
    
        } catch (err) {
            res.status(400).json({ message: err })
        }
    }
    else {
        return res.status(400).json({
            message: "Invalid request"
        })
    }
})

// Muuttaa ryhmän jäsenen tietoja
router.patch('/:key/:member', async (req, res) => {
    try {
        if (req.body.burgers) {
            if (req.body.burgers < 0) return res.status(400).json({ message: "Product value can't be under zero"})
            const updatedGroup = await Group.updateOne(
                { 'groupKey': req.params.key, 'members.memberName': req.params.member},
                { '$set': {
                    'members.$.burgers': req.body.burgers,
                }}
            )
            res.status(200).json(updatedGroup)
        }
        else if (req.body.smallCans) {
            if (req.body.smallCans < 0) return res.status(400).json({ message: "Product value can't be under zero"})
            const updatedGroup = await Group.updateOne(
                { 'groupKey': req.params.key, 'members.memberName': req.params.member},
                { '$set': {
                    'members.$.smallCans': req.body.smallCans
                }}
            )
            res.status(200).json(updatedGroup)
        }
        else if (req.body.bigCans) {
            if (req.body.bigCans < 0) return res.status(400).json({ message: "Product value can't be under zero"})
            const updatedGroup = await Group.updateOne(
                { 'groupKey': req.params.key, 'members.memberName': req.params.member},
                { '$set': {
                    'members.$.bigCans': req.body.bigCans
                }}
            )
            res.status(200).json(updatedGroup)
        }
        else {
            return res.status(400).json({
                message: "Invalid request"
            })
        }
    } catch (err) {
        res.status(400).json({ message: err })
    }
    
})

// Poistaa halutun ryhmän joko _id:n, tai ryhmäkoodin perusteella
router.delete('/:key', async (req, res) => {
    try {
        let removedGroup;
        if (req.params.key == "delete_all") {
            removedGroup = await Group.deleteMany({})
        }
        else {
            removedGroup = await Group.deleteOne({groupKey: req.params.key})
        }
        if (removedGroup.deletedCount == 0) {
            return res.status(404).json({
                message: "No valid entry found for given key"
            })
        }
        res.status(200).json(removedGroup)
    } catch (err) {
        res.status(200).json({ message: err })
    }
})


// Luotujen routereiden jakaminen sovelluksen käyttöön
module.exports = router