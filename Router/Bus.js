const router=require("express").Router()
const controller=require("../Controller/Bus")

router.get("",controller.select)
router.post("",controller.addBus)
router.put("/driver/:id",controller.assignDriver)
router.put("/trip/:id",controller.assignTrip)
router.put("/:id",controller.updateBus)
router.delete("/:id",controller.delete)

module.exports=router