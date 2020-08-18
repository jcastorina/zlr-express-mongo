// import npm tools

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')
const autocorrect = require('autocorrect')()

// import local tools

const mongoTools = require('../MongoTools')


// create local db connection

const uri = 'mongodb://localhost:27017'
mongoose.connect( uri, { useUnifiedTopology: true, useNewUrlParser: true } )


// import mock cache

const unprocessedFruitDb = require('../fruitDb')


// create Schema-specific function to cache import list as mongo records


const fruitDbProcessor = mongoTools.apply(mongoTools.types.Fruit)
let fruitMongoRecordsMem = fruitDbProcessor(unprocessedFruitDb)

// routes

// Submit Section

router.post('/transpose', (req,res)=>{

    console.log('/transpose Accessed')

    const split = req.body.data.split(' ')
    let autoCorrected = Array()
    let fixed = Array()

    for(i of split){

        autoCorrected.push(autocorrect(i))
    }

    for(i in autoCorrected){

        if(autoCorrected[i].length < 3){

            fixed.push(split[i])
        } else {

            fixed.push(autoCorrected[i])
        }
    }

    const promiseArray = fixed.map(word => {
     
        return new Promise((resolve, reject) => {
            
            if( word.length < 3 ){ 

                resolve(word) 
            
            } else {

                thesaurus(word, (error, body) => {
  
                    if (error) {
                        
                        return(resolve(word))
                    } else if (body) {

                        if(body.length){
                            
                            return(resolve(body[Math.floor(Math.random()*body.length)]))
                        } else {
                            
                            let arr = Array()
                            
                            if(body.noun){
                                
                                arr = body.noun.syn

                            } else {

                                arr = body.adjective.sim
                            }
                                                  
                            return(resolve(arr[Math.floor(Math.random()*arr.length)]))    
                        }                           
                    } else {
                        
                        return(reject(null))
                    }
                })
            } 
        })
    })

    Promise.all(promiseArray)
    .then((words) => {
        console.log(words, 'words')
        let sentence = words.join(' ')
        res.json({ 'converted': sentence })
    })
    .catch(err=>console.error(err))
})


router.get('/addFruit', (req,res)=>{

    const fruitDbProcessor = mongoTools.apply(mongoTools.types.Fruit)
    fruitMongoRecordsMem = fruitDbProcessor(unprocessedFruitDb)

    res.json({ message: 'refreshed list'})
})

router.get('/saveFruit', (req,res)=>{

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

router.get('/deleteDuplicates', (req,res)=>{

    console.log('/deleteDuplicates accessed')

    mongoTools.deleteDuplicates(mongoTools.types.Fruit, (err,records) => {

        if(err) {
            res.json({ error: err })
        }

        res.json({ records: records })
    })
})

router.get('/nytJSON', (req,res)=>{

    axios.get('https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=plQgtYtGZFGF1oGfqpFISOSZtcUwXqgX')
    .then(result=>{

        const url = result.data.results[0].link.url

        axios.get(url)
        .then(response=>{
            const html = response.data
            const $ = cheerio.load(html).text(); 
            console.log($)
            res.json({ message: 'done' })
        })
    })  
})


// Oxford Dictionary Section

const appId = '7c71f8d9'
const appKey = 'a85bf9806df34ad0b94aa84ca38acd27'
const define = 'feign'
const oxfordUri = 'https://od-api.oxforddictionaries.com:443/api/v2/entries/en/' + define


router.get('/getWord', (req,res)=>{

    console.log('/getWord accessed')

    axios.get(oxfordUri, {
        headers: {
            "app_id": appId,
            "app_key": appKey
        }
    })
    .then(result=>{
        res.json({ results: result.data.results})
    })
})


// Thesaurus Section


const thesaurus = (word,cb) => {

    const thesaurusUri = 'https://words.bighugelabs.com/api/2/'
    const key = '952d4151cc53f2750a974bafdc86ec47/'
    const format = '/json'

    return axios.get(thesaurusUri+key+word+format)
    .then(results=>{

        return cb(null,results.data)
    })
    .catch(err=>{

        return cb(err,null)
    })

}

const thesaurusCleaner = (error, body) => {
    

}


const thesaurusUri = 'https://words.bighugelabs.com/api/2/'
const key = '952d4151cc53f2750a974bafdc86ec47/'
const word = 'feign'
const format = '/json'

router.post('/doThesaurus', (req,res)=>{

    let word = req.body.data
    
    console.log('/doThesaurus accessed')

    new Promise((resolve, reject) => {
            
        if( word.length < 3 ){ 

            resolve(word) 
        
        } else {

            thesaurus(word, (error, body) => {

                if (error) {
                    
                    return(resolve(word))
                } else if (body) {

                    if(body.length){
                        
                        return(resolve(body[Math.floor(Math.random()*body.length)]))
                    } else {
                        
                        let arr = Array()
                        
                        if(body.noun){
                            
                            arr = body.noun.syn

                        } else {

                            arr = body.adjective.sim
                        }
                                              
                        return(resolve(arr[Math.floor(Math.random()*arr.length)]))    
                    }                           
                } else {
                    
                    return(reject(null))
                }
            })
        } 
    })

    .then(results=>{
        console.log(results, ' results')
        res.json({ results: results })
    })
    .catch(err=>{console.log(err, 'thesaurus error')})
})

router.post('/autocorrect', (req,res)=>{
    
    console.log(req.body)
    res.json({ autocorrected: autocorrect(req.body.data) })
})

// NYT API
// 
// Pub Key
// plQgtYtGZFGF1oGfqpFISOSZtcUwXqgX
//
// Secret Key 
// GyNF2XIXqQVmK1Cp

// Oxford API
//
// App ID
// 7c71f8d9
//
// App Key
// a85bf9806df34ad0b94aa84ca38acd27

// Thesaurus API
//
// Pub Key
// 952d4151cc53f2750a974bafdc86ec47

module.exports = router