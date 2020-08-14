// import npm tools

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


// import local tools

const mongoTools = require('../MongoTools')


// create local db connection

const uri = 'mongodb://localhost:27017'
mongoose.connect( uri, { useUnifiedTopology: true, useNewUrlParser: true } )


// import mock cache

const unprocessedFruitDb = require('../fruitDb')


// apply Schema template to imported cache and convert to Mongo records

const fruitDbProcessor = mongoTools.apply(mongoTools.types.Fruit)
const fruitMongoRecordsMem = fruitDbProcessor(unprocessedFruitDb)


// routes

router.get('/addFruit', (req,res)=>{

    console.log('/addFruit accessed')

    mongoTools.saveRecords(fruitMongoRecordsMem, (err,fruits) => {

        if(err) {
            res.json({ error: err })
        }
        
        res.json({ success: fruits })
    })
})

router.get('/viewFruit',(req,res)=>{

    console.log('/viewFruit accessed')

    mongoTools.findRecords(mongoTools.types.Fruit, (err,records) => {

        if(err) {
            res.json({ error: err })
        }

        res.json({ records: records })
    })
})

module.exports = router