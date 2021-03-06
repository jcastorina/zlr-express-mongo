const FruitModel = require('./fruit')

module.exports = {
    
    types: {
        
        Fruit: FruitModel

    },
    
    apply: (Model) => {
 
        return (db) => {
            let results = Array()
    
            db.forEach(item => {
        
                results.push(new Model(item))
            })
    
            return results  
        }
    },

    findRecords: (collection, cb) => {

        let results = Array()

        let counter = 0

        collection.find((err,items)=>{

            if(err) {
                return cb(err)
            }

            items.forEach(item=>{

                results.push(item)
                counter = counter + 1
                
                if(counter === items.length){
                    let err = null
                    return cb(err,results)
                }
            })
        })
    },

    saveRecords: (records,cb) => {

        let results = Array()
    
        let count = 0

        records.forEach(record=>{
    
            record.save((err,result)=>{
                
                if(err) { 
                    return cb(err) 
                }

                results.push(result.name)
                count += 1
    
                console.log(`${result.name} saved successfully`)

                if(count === records.length){
                    let err = null
                    cb(err,results)
                }
            })
        })
    },

    deleteDuplicates: (collection,cb) => {

        let duplicates = {}
        let count = 0

        collection.find((err,items)=>{

            if(err){
                return cb(err)
            }

            items.forEach(item=>{
                
                if( item.name in duplicates ){
    
                    collection.findOneAndDelete(item.name,(err,result)=>{
                    
                        if(err) {
                            return cb(err)
                        }
    
                        duplicates[item.name] += 1
                        count += 1

                        if(count === items.length){                  

                            (()=>{
                                
                                console.log('deleted:\n')
                                
                                for( key in duplicates ){

                                    console.log('-- '+key+' : '+duplicates[key])
                                }
                            })()

                            let err = null
                            return cb(err,duplicates)
                        }                    
                    })

                } else {

                    duplicates[item.name] = 1
                    count += 1
                }
            })
        })
    }
}
