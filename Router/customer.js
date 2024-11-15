const router=require("express").Router()
const controller=require('../Controller/customer')
const MiddleWare = require("../Middleware/Authenticate")

router.get("",MiddleWare.checkAuth,controller.select)
router.post("",MiddleWare.checkAuth,controller.add)//MiddleWare.checkAuth,
router.post("/login",controller.login)
router.post("/signUp",controller.signUp)
router.put("/trip/:id",MiddleWare.checkAuth,controller.assignTrip)
router.put("/:id",MiddleWare.checkAuth,controller.update)
router.delete("/:id",MiddleWare.checkAuth,controller.delete)

module.exports=router
