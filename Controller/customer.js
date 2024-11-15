//require
const {ObjectId}=require('mongodb')
const CustomersModel = require("../Model/customer")
const JOI = require("joi")
const BCrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//
exports.select = async (request, response) => {
    const customer = await CustomersModel.selectAll()
    return response.status(200).json(customer)
}

exports.add = async (request, response) => {
    const customer = request.body
    const scheme = JOI.object({
        name: JOI.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        phone: JOI.string().length(11).pattern(/^[0-9]+$/),
        email: JOI.string().email().min(5).max(20),
        password: JOI.string().min(5).max(20)
    })
    
    const ValidateOutput = scheme.validate(customer)

    if (ValidateOutput.error) {
        return response.status(400).json(ValidateOutput.error);
    }

    //selectOne() method takes the body object:
    //const customer = request.body; @ line 12
    const searchQueryResult = await CustomersModel.selectOne({
        email: customer.email
    });

    //and then, this if condition checks:
    //if customer is duplicated then send 400 bad request,
    //, customer is duplicated
    if (searchQueryResult) {
        return response.status(400).json({
            status: "OK",
            message: "Duplicated"
        })
    }

    //to encrypt the password of the customer, bcrypt is used
    const password = customer.password
    const salt = BCrypt.genSaltSync(10) //10 is the number of rounds AKA how secure is the ecryption process
    const hashedPassword = BCrypt.hashSync(password, salt)

    //if the customer is not duplicated, therefore the following
    //lines will be executed
    customer.password = hashedPassword

    const queryResult = await CustomersModel.add(customer)
    return response.status(201).json(queryResult)
}
exports.assignTrip = async (request, response) => 
{
    const trips=request.body.trips
    const customer = request.body
    const id = request.params.id
    customer.id= id
    const arrTrip=trips.map(trip=>{
        return new ObjectId(trip)
    }) 
    const scheme = JOI.object({
        id:JOI.string().min(10).max(30),
        name: JOI.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        phone: JOI.string().length(11).pattern(/^[0-9]+$/),
        email: JOI.string().email().min(5).max(20),
        trips:JOI.array()
    })
    
    const ValidateOutput = scheme.validate(customer)

    if (ValidateOutput.error) {
        return response.status(400).json(ValidateOutput.error);
    }
    const queryResult = await CustomersModel.assignTrip(customer,arrTrip)
    if(queryResult.value)//value exists
    {
        return response.status(200).json(queryResult)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}
exports.update = async (request, response) => {
    //get data
    const customer = request.body
    const id = request.params.id
    customer.id= id

    //perform validation on the data
    const scheme = JOI.object({
        id: JOI.string().min(3).max(30),
        name: JOI.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        phone: JOI.string().length(11).pattern(/^[0-9]+$/),
        email: JOI.string().email().min(5).max(20),
        password: JOI.string().min(5).max(20)
    })
    //  const arrProd=products.map(product=>{
    //     return new ObjectId(product)
    // })

    const ValidateOutput = scheme.validate(customer)

    if (ValidateOutput.error) {
        return response.status(400).json(ValidateOutput.error)
    }

    //check for duplicated data
    const searchQueryResult = await CustomersModel.selectOne({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        password: customer.password
    })

    if (searchQueryResult) {
        return response.status(400).json({
            status: "OK",
            message: "Duplicated"
        })
    }

    const queryResult = await CustomersModel.update(customer)

    if(queryResult.value)//value exists
    {
        return response.status(200).json(queryResult)
    }
    return response.status(404).json({status:"error",message:"id not found"})
}

exports.delete = async (request, response) => {
    const id = request.params.id

    const queryResult = await CustomersModel.delete(id)

    //if the ID if found, return response 200
    if (queryResult.value) {
        return response.status(200).json(queryResult)
    }
    //else return response 404
    return response.status(404).json(queryResult);
};

exports.login = async (request, response) => {
    // 1- get data
    const customer = request.body

    // 2- use the method selectOne() ==> email, password
    const customerPayLoad = await CustomersModel.selectOne({
        email: customer.email,
    })

    if (!customerPayLoad) {
        return response.status(404).json({
            status: "error",
            message: "Email not found"
        })
    }

    // 3- compare
    const comparePassword = BCrypt.compareSync(
        customer.password,
        customerPayLoad.password
    )

    if (!comparePassword) {
        return response.status(400).json({
            status: "error",
            message: "invalid password"
        })
    }

    jwt.sign(
        {
            id: customerPayLoad._id,
            email: customerPayLoad.email,
        },
        "1234567",
        (error, token) => {
            if (error)
                return response.status(500).json({
                    status: "error",
                    message: "internal server error"
                })

            return response.status(200).json({
                token
            })
        }
    )
}

exports.signUp=async(request, response) => {
    const customer = request.body
    const scheme = JOI.object({
        name: JOI.string().min(3).max(10).pattern(/[a-zA-Z\ ]{3,10}/),
        phone: JOI.string().length(11).pattern(/^[0-9]+$/),
        email: JOI.string().email().min(5).max(20),
        password: JOI.string().min(5).max(20)
    })
    
    const ValidateOutput = scheme.validate(customer)

    if (ValidateOutput.error) {
        return response.status(400).json(ValidateOutput.error);
    }

    //selectOne() method takes the body object:
    //const customer = request.body; @ line 12
    const searchQueryResult = await CustomersModel.selectOne({
        email: customer.email
    });

    //and then, this if condition checks:
    //if customer is duplicated then send 400 bad request,
    //, customer is duplicated
    if (searchQueryResult) {
        return response.status(400).json({
            status: "OK",
            message: "Duplicated"
        })
    }

    //to encrypt the password of the customer, bcrypt is used
    const password = customer.password
    const salt = BCrypt.genSaltSync(10) //10 is the number of rounds AKA how secure is the ecryption process
    const hashedPassword = BCrypt.hashSync(password, salt)

    //if the customer is not duplicated, therefore the following
    //lines will be executed
    customer.password = hashedPassword

    const queryResult = await CustomersModel.add(customer)
    return response.status(201).json(queryResult)
}