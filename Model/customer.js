const { ObjectId } = require("mongodb");
const TripModel=require("../Model/trip")
exports.getConnection = async () => 
{
    const MongoClient = require("mongodb").MongoClient;
    const connection = await new MongoClient("mongodb://127.0.0.1:27017").connect();
    const db = await connection.db("ScarTravel");
    const collections = db.collection("Customer");
    return collections;
}
exports.selectAll= async() => 
{
    const collections=await this.getConnection()
    const customers=await collections.aggregate([
        {
            $lookup:
            {
                from:"Trip",
                localField:"trips",
                foreignField:"_id",
                as:"trips"
            }
        }
    ]).toArray()
    return customers
}
exports.selectOne = async(filter) => {

    const collections = await this.getConnection()
    const customers = await collections.findOne(filter)
    return customers

}
exports.add = async(customer,trips) => 
{
    const collections = await this.getConnection();
    const queryResult = await collections.insertOne({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        password: customer.password,
        trips:trips
    })
    return queryResult
}
//put
exports.assignTrip = async(customer,trips)=>
{
    const collections = await this.getConnection() 
    const TripCollection=await TripModel.getConnection()
    const queryResult = await collections.findOneAndUpdate({
        _id: new ObjectId(customer.id)
    },
    {
        $set:{
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            trips:trips
        }
    })
    let t=await TripCollection
    const arr=[customer.id]
    for(let x=0;x<trips.length;x++){
     t.findOneAndUpdate({
        _id: new ObjectId(trips[x])
    },{
        $set:{
            customers:arr
        }
    })
    }
        return queryResult
}
exports.update = async(customer)=>
{
    const collections = await this.getConnection() 
    const queryResult = await collections.findOneAndUpdate({
        _id: new ObjectId(customer.id)
    },
    {
        $set:{
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            password: customer.password
        }
    })
        return queryResult
}
exports.delete=async(id)=>
{
    const collections=await this.getConnection()
    const customers=await collections.findOneAndDelete({
        _id: new ObjectId(id)
    })
    return customers
}