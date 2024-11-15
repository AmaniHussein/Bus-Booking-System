const { ObjectId } = require('mongodb')
const BusModel=require("../Model/Bus")
exports.getConnection = async () => {
    const MongoClient = require('mongodb').MongoClient
    const connect = await new MongoClient("mongodb://127.0.0.1:27017").connect()
    const db = await connect.db("ScarTravel")
    const collections = db.collection("Driver")
    return collections
}
exports.select = async () => {
    const collections = await this.getConnection()
    const drivers = await collections.aggregate([
        {
            $lookup:
            {
                from: "Bus",
                localField: "busId",
                foreignField: "_id",
                as: "bus"
            }
        }
    ]).toArray()
    

    return drivers
}
exports.selectOne = async (filter) => {
    const collections = await this.getConnection()
    const drivers = await collections.findOne(filter)
    return drivers
}
exports.addDriver = async (driver) => {

    const collections = await this.getConnection()
    const drivers = await collections.insertOne(driver)
    return drivers
}
//put
exports.assignBus = async (driver, busId) => {
    const collections = await this.getConnection()
    const Buscollection=await BusModel.getConnection()

    const drivers = await collections.findOneAndUpdate({
        _id: new ObjectId(driver.id)
    },
        {
            $set: {
                name: driver.name,
                liscensenumber: driver.liscensenumber,
                phone: driver.phone,
                busId: new ObjectId(busId)
            }
        })
        const d=await Buscollection.findOneAndUpdate({
            _id:new ObjectId(busId)
        },{
            $set:{
                Driverid:new ObjectId(driver.id)
            }
        })
    return drivers
}
exports.updateDriver = async (driver,id) => {
    const collections = await this.getConnection()
    const drivers = await collections.findOneAndUpdate({
        _id: new ObjectId(id)
    },
        {
            $set: {
                name: driver.name,
                liscensenumber: driver.liscensenumber,
                phone: driver.phone,
            }
        })
    return drivers
}
exports.delete = async (id) => {
    const collections = await this.getConnection()
    const drivers = await collections.findOneAndDelete({
        _id: new ObjectId(id)
    })
    return drivers
}

// exports.check = async () => {
//     const collections = await getConnection()
//     //const Buscollection = db.collection("Bus")
//     const Buscollection=await BusModel.getConnection()
//     const DriverID=await collections.distinct('_id', {}, {})
//     const BusID=await collections.find("64eeff1241b10e957721b3e1").distinct('busId', {}, {}).toString()
//     // const final=await Buscollection.findOneAndUpdate({
//     //     _id:new ObjectId(BusID)
//     // },{
//     //     $set:{
//     //         Driverid:DriverID
//     //     }
//     // })
//     console.log(BusID)
     
    

// }