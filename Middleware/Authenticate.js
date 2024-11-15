const jwt = require("jsonwebtoken")

exports.checkAuth = (request , response , next)=>{

    const token = request.headers.authorization

    jwt.verify(token , '1234567',{},(error, decodedToken)=>{
        if (error) {
            console.log(error);

            return response.status(401).json({
                status:"error",
                message:"Unauthorized"
            })
            
        }

        request.decodedToken  = decodedToken

        next()

    })
} 