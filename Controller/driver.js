//require
const model=require('../Model/driver')
const joi=require('joi')
//
exports.select=async(request,response)=>
{
    const drivers = await model.select()
    return response.status(200).json(drivers)
}
exports.addDriver=async(request,response)=>
{   
    const driver = request.body
    const criteria = joi.object({
        name: joi.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        liscensenumber: joi.string().length(16).pattern(/^[0-9]+$/).required(),
        phone: joi.string().length(11).pattern(/^[0-9]+$/).required()
    })
    const valid = criteria.validate(driver)
    if(valid.error)
    {
        return response.status(400).json(valid.error)
    }
    //
    const dup= await model.selectOne({
        liscensenumber: driver.liscensenumber
    })
    //
    if(dup)
    {
        return response.status(400).json({message:'Duplicate books found'})
    }
    const data=await model.addDriver(driver)
    return response.status(201).json(data)
}
exports.assignBus=async(request,response)=>
{
    const busId=request.body.busId
    const id = request.params.id
    const driver = request.body
    driver.id =  id
    const criteria = joi.object({
        id:joi.string().min(10).max(30),
        name: joi.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        liscensenumber: joi.string().length(16).pattern(/^[0-9]+$/),
        phone: joi.string().length(11).pattern(/^[0-9]+$/),
        busId:joi.string().min(20).max(30)
    })
    const valid=criteria.validate(driver)
    if(valid.error)//crteria failed
    {
        return response.status(400).json(valid.error)
    }
    const data=await model.assignBus(driver,busId)
    if(data.value)//value exists
    {
        return response.status(200).json(data)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
exports.updateDriver=async(request,response)=>
{
    const id = request.params.id
    const driver = request.body
    const criteria = joi.object({
        name: joi.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        liscensenumber: joi.string().length(16).pattern(/^[0-9]+$/).required(),
        phone: joi.string().length(11).pattern(/^[0-9]+$/).required()
    })
    const valid=criteria.validate(driver)
    if(valid.error)//crteria failed
    {
        return response.status(400).json(valid.error)
    }
    const dup= await model.selectOne({
        liscensenumber: driver.liscensenumber
    })
    //
    if(dup)//duplicate
    {
        return response.status(400).json({message:'Duplicate books found'})
    }
    //
    const data=await model.updateDriver(driver,id)
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

// exports.check=async(request,response)=>{    
//     const result =await model.check()
//     return response.status(200).json(result)    
// }