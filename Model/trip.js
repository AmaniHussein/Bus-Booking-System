const {ObjectId}=require('mongodb')
const BusModel=require("../Model/Bus")
const CustomerModel=require("../Model/customer")
exports.getConnection=async()=>
{
    const MongoClient = require('mongodb').MongoClient
    const connect = await new MongoClient("mongodb://127.0.0.1:27017").connect()
    const db = await connect.db("ScarTravel")
    const collections = db.collection("Trip")
    return collections
}
exports.select=async()=>
{
    const collections=await this.getConnection()
    const trips=await collections.aggregate([
        {
            $lookup:
            {
                from:"Bus",
                localField:"busId",
                foreignField:"_id",
                as:"bus"
            }
        },
        {
            $lookup:
            {
                from:"Customer",
                localField:"customers",
                foreignField:"_id",
                as:"customer"
            }
        }
    ]).toArray()
    return trips
}
exports.selectOne = async (filter) => 
{
    const collections = await this.getConnection()
    const trips = await collections.findOne(filter)
    return trips
}
exports.add=async(trip)=>
{
    const collections=await this.getConnection()
    const trips=await collections.insertOne({
        price:trip.price,       
        date:new Date(),        
        pickup:trip.pickup,  
        destination:trip.destination,
    })
    return trips
}
//put
exports.assignCustomer=async(trip,customers)=>
{
    const collections=await this.getConnection()
    const CustomerCollection= await CustomerModel.getConnection()
    const trips=await collections.findOneAndUpdate({
        _id: new ObjectId(trip.id)
    },
    {
        $set: {
            price:trip.price,//date?
            pickup:trip.pickup,
            destination:trip.destination,
            customers:customers
        }
    })
    let t=await CustomerCollection
    const arr=[trip.id]
    for(let x=0;x<trips.length;x++){
     t.findOneAndUpdate({
        _id: new ObjectId(customers[x])
    },{
        $set:{
            customers:arr
        }
    })
    }
    return trips
}
exports.update=async(trip)=>
{
    const collections=await this.getConnection()
    const trips=await collections.findOneAndUpdate({
        _id: new ObjectId(trip.id)
    },
    {
        $set: {
            price:trip.price,
            date:new Date(),
            pickup:trip.pickup,
            destination:trip.destination
        }
    })
    return trips
}
exports.delete=async(id)=>
{
    const collections=await this.getConnection()
    const trips=await collections.findOneAndDelete({
        _id: new ObjectId(id)
    })
    return trips
}
exports.assignBus=async (trip,busID)=>{
    const collections=await this.getConnection()
    const Buscollection=await BusModel.getConnection()
    const trips=await collections.findOneAndUpdate({
        _id: new ObjectId(trip.id)
    },{
        $set:{
            price:trip.price,
            pickup:trip.pickup,
            destination:trip.destination,
            busId:new ObjectId(busID)
        }
    })
    const arr=[trip.id]
    //console.log(arr)
    const b=await Buscollection.findOneAndUpdate({
        _id: new ObjectId(busID)
    },{
        $set:{
            TripID:arr
        }
    })

    return trips
}