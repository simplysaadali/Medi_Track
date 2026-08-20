const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const protect = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/appointments", protect, requireRole("staff"), async (req, res) => {
  const appointments = (await Appointment.find().populate("owner", "name email")).sort({ scheduledFor: 1 })
  res.json({ appointments });
});

router.patch("/appointments/:id/status", protect, requireRole("staff"), async (req, res) => {
  const { status } = req.body;
  if(!["confirmed", "cancelled"].includes(status))
    return res.status(400).json({ message: "Invalid Status "});
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ appointment });
});

module.exports = router;
