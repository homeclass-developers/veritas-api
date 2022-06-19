const packageRouter = require('express').Router()
const {verifyToken} = require('../controllers/auth')
const asyncHandler = require('express-async-handler')
const Packages = require('../models/Packages')
const Conversions = require('../models/Conversions')


// get packages by country

packageRouter.post("/get-package-by-country", verifyToken, asyncHandler((req, res)=>{
    const {country} = req.body

    if(!country){
        return res.status(422).json({invalid: "No Country selected"})
    }else{
        Packages.find({country, availability: true}).then(packages=>{
            return res.status(200).json({packages})
        }).catch(error=>{
            console.log(error)
            return res.status(500).json({invalid: "An Internal server error occur"})
        })
    }
}))


// get packages by service name

packageRouter.post("/get-package-by-service-name", verifyToken, asyncHandler((req, res)=>{
    const {serviceName} = req.body

    if(!serviceName){
        return res.status(422).json({invalid: "No Visa selected"})
    }else{
        Packages.find({serviceName, availability: true}).then(packages=>{
            return res.status(200).json({packages})
        }).catch(error=>{
            console.log(error)
            return res.status(500).json({invalid: "An Internal server error occur"})
        })
    }
}))

// get conversion rate

packageRouter.post("/get-conversion-rate", verifyToken, asyncHandler((req, res)=>{
    const {currency} = req.body

    Conversions.findOne({currency}).then(rate=>{
        
        if(rate){
            return res.status(200).json({rate})
        }
        else{
            return res.status(200).json({rate: 600})
        }
    })
}))

module.exports = {packageRouter}