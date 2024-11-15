const router=require('express').Router()
const controller=require('../Controller/driver')

router.get("",controller.select)
// router.get("",controller.select)
router.post("",controller.addDriver)
router.put("/bus/:id",controller.assignBus)
router.put("/:id",controller.updateDriver)
router.delete("/:id",controller.delete)

module.exports=router