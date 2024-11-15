const {ObjectId}=require('mongodb')
const DriverModel=require("../Model/driver")
const TripModel=require("../Model/trip")
exports.getConnection=async()=>
{
    const MongoClient = require('mongodb').MongoClient
    const connect = await new MongoClient("mongodb://127.0.0.1:27017").connect()
    const db = await connect.db("ScarTravel")
    const collections = db.collection("Bus")
    return collections
}
exports.select=async ()=>
{
    const collection=await this.getConnection()
    const final=await collection.aggregate([
        {
            $lookup:
            {
                from:"Driver",
                localField:"DriverID",
                foreignField:"_id",
                as:"Driver"
            }
        }
    ]).toArray()
    return final
}
exports.selectOne=async (content)=>
{
    const collection=await this.getConnection()
    const final=await collection.findOne(content)
    return final
}
exports.addBus=async(bus,driverID)=>
{
    const collections=await this.getConnection()
    const buses=await collections.insertOne({
        busNumber:bus.busNumber,
    })
    return buses
}
exports.assignDriver=async (body,Driverid)=>
{
    const collection=await this.getConnection()
    const DriverCollection=await DriverModel.getConnection()
    const final=await collection.findOneAndUpdate({
        _id: new ObjectId(body.id)
    },{
        $set:{
            busNumber:body.busNumber,
            Driverid: new ObjectId(Driverid)
        }
    })
    const b=await DriverCollection.findOneAndUpdate({
        _id: new ObjectId(Driverid)
    },{
        $set:{
            busId: new ObjectId(body.id)
        }
    })
    return final
}
exports.updateBus=async (id,body)=>
{
    const collection=await this.getConnection()
    const final=await collection.findOneAndUpdate({
        _id: new ObjectId(id)
    },{
        $set:{      
            busNumber:body.busNumber,
        }
    })
    return final
}
exports.delete=async (id)=>
{
    const collection=await this.getConnection()
    const final=await collection.findOneAndDelete({
        _id: new ObjectId(id)
    })
    return final
}

exports.assignTrip=async (body,TripId)=>{
    const collection=await this.getConnection()
    const TripCollection= await TripModel.getConnection()
    const trips=await collection.findOneAndUpdate({
        _id: new ObjectId(body.id)
    },{
        $set:{
            busNumber:body.busNumber,
            TripID:TripId
        }
    })
    let stringsArray=TripId
    for(let x=0;x<TripId.length;x++){
    stringsArray =TripId[x].toString();}
  //  console.log(stringsArray)
    const t=await TripCollection.findOneAndUpdate({
        _id: new ObjectId(stringsArray)
    },{
        $set:{
               busId:new ObjectId(body.id)
        }
    })
    return trips
}