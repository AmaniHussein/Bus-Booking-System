const router=require("express").Router()
const controller=require('../Controller/trip')

router.get("",controller.select)
router.post("",controller.add)
router.put("/customer/:id",controller.assignCustomer)
router.put("/bus/:id",controller.assignBus)
router.put("/:id",controller.update)
router.delete("/:id",controller.delete)

module.exports=router