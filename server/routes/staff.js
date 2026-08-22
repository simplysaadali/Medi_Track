const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const protect = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/appointments", protect, requireRole("staff"), async (req, res) => {
  const appointments = await Appointment.find()
    .populate("owner", "name email")
    //tells the mongoose to go to db and change the objectId with the user data, due to the
//     owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
// } in the schrma
    .sort({ scheduledFor: 1 }); //ascending order, (1, 2, 3, 4, ....)
  res.json({ appointments }); //send the appoointments to the frontend
});

router.patch("/appointments/:id/status", protect, requireRole("staff"), async (req, res) => {
  const { status } = req.body; //gives the new status
  if(!["confirmed", "cancelled"].includes(status)) //check here the status
    return res.status(400).json({ message: "Invalid Status "});
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ appointment });
});

module.exports = router;
