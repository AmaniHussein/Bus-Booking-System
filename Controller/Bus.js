const busModel=require("../Model/Bus")
const joi=require("joi")
const {ObjectId}=require('mongodb')

exports.select=async (request,response)=>
{
    const result=await busModel.select()
    return response.status(200).json(result)
}
exports.addBus=async (request,response)=>
{
    const DriverID=request.body.DriverID//id driver
    const body=request.body//id bus
    const scheme=joi.object({
        busNumber:joi.number().integer().required()
    })
    //validation
    const valid = scheme.validate(body)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    const dup= await busModel.selectOne({
        busNumber: body.busNumber
    })

    //duplicate
    if(dup)
    {
        return response.status(400).json({message:'Duplicate found'})
    }
    const result= await busModel.addBus(body,DriverID)//driverid
    return response.status(201).json(result) 
}
exports.assignDriver=async (request,response)=>
{
    const driverId=request.body.driverId
    const id=request.params.id//bus id
    const body=request.body//bus
    body.id=id
    const scheme=joi.object({
        id:joi.string().min(10).max(30),
        busNumber:joi.number().integer().required(),
        driverId:joi.string().min(10).max(30)
    })

    //validation
    const valid = scheme.validate(body)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    const result= await busModel.assignDriver(body,driverId)
    if(result.value)//value exists
    {
        return response.status(200).json(result) 
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
exports.updateBus=async (request,response)=>
{
    const busID=request.params.id//bus id
    const body=request.body//bus
    body.id=busID
    const scheme=joi.object({
        id:joi.string().min(10).max(30),
        busNumber:joi.number().integer().required()
    })

    //validation
    const valid = scheme.validate(body)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    const dup= await busModel.selectOne({
        busNumber: body.busNumber
    })

    //duplicate
    if(dup)
    {
        return response.status(400).json({message:'Duplicate found'})
    }
    const result= await busModel.updateBus(busID,body)//body
    return response.status(200).json(result) 

}
exports.delete=async (request,response)=>
{
    const busID=request.params.id
    const result =await busModel.delete(busID)
    if(result.value){
        return response.status(200).json(result)
    }
    else{
    return response.status(404).json(result)
    }
}

exports.assignTrip=async (request,response)=>{
    const TripId=request.body.TripID
    const id=request.params.id//bus id
    const body=request.body//bus
    body.id=id
     const arrTrips=TripId.map(TripID=>{
         return new ObjectId(TripID)
     }) 
    const scheme=joi.object({
        id:joi.string().min(10).max(30),
        busNumber:joi.number().integer().required(),
        TripID:joi.array()
    })

    //validation
    const valid = scheme.validate(body)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    const result= await busModel.assignTrip(body,arrTrips)
    if(result.value)//value exists
    {
        return response.status(200).json(result) 
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
