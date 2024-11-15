//require
const {ObjectId}=require('mongodb')
const model=require('../Model/trip')
const joi=require('joi')

//
exports.select=async(request,response)=>
{
    const trips = await model.select()
    return response.status(200).json(trips)
}
exports.add=async(request,response)=>
{   
    const trip = request.body
    const criteria = joi.object({
        price: joi.string().length(3).pattern(/^[0-9]+$/).required(),
        pickup: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/),
        destination: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/).required(),
    })
    const valid = criteria.validate(trip)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    //
    const dup= await model.selectOne({
        destination: trip.destination
    })
    //
    if(dup)
    {
        return response.status(400).json({message:'Duplicate books found'})
    }
    const data=await model.add(trip)
    return response.status(201).json(data)
}
exports.assignCustomer=async(request,response)=>
{
    const customers = request.body.customers
    const id = request.params.id
    const trip = request.body
    trip.id =  id
    const arrCustomer=customers.map(customer=>{
        return new ObjectId(customer)
    }) 
    const criteria = joi.object({
        id:joi.string().min(10).max(30),
        price: joi.string().length(3).pattern(/^[0-9]+$/).required(),
        pickup: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/),
        destination: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/).required(),
        customers:joi.array()
    })
    const valid=criteria.validate(trip)
    if(valid.error)//crteria failed
    {
        return response.status(400).json(valid.error)
    }
    const data=await model.assignCustomer(trip,arrCustomer)
    if(data.value)//value exists
    {
        return response.status(200).json(data)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
exports.update=async(request,response)=>
{
    const id = request.params.id
    const trip = request.body
    trip.id =  id
    const criteria = joi.object({
        id:joi.string().min(10).max(30),
        price: joi.string().length(3).pattern(/^[0-9]+$/).required(),
        pickup: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/),
        destination: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/).required(),
    })
    const valid=criteria.validate(trip)
    if(valid.error)//crteria failed
    {
        return response.status(400).json(valid.error)
    }
    const dup= await model.selectOne({
        destination: trip.destination
    })
    //
    if(dup)//duplicate
    {
        return response.status(400).json({message:'Duplicate books found'})
    }
    //
    const data=await model.update(trip)
    if(data.value)//value exists
    {
        return response.status(200).json(data)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
exports.delete=async(request,response)=>
{
    const id = request.params.id
    const queryResult =  await model.delete(id)
    if (queryResult.value) 
    {
        return response.status(200).json(queryResult)
    }
    return response.status(404).json(queryResult)
}

exports.assignBus=async (request,response)=>{
    const busId = request.body.busId
    const id = request.params.id
    const trip = request.body
    trip.id =  id
    const criteria = joi.object({
        id:joi.string().min(10).max(30),
        price: joi.string().length(3).pattern(/^[0-9]+$/).required(),
        pickup: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/),
        destination: joi.string().min(3).max(40).pattern(/^[a-zA-Z\ ]{3,40}$/).required(),
        busId:joi.string().min(10).max(30)
    })
    const valid=criteria.validate(trip)
    if(valid.error)//crteria failed
    {
        return response.status(400).json(valid.error)
    }
    const data=await model.assignBus(trip,busId)
    if(data.value)//value exists
    {
        return response.status(200).json(data)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}