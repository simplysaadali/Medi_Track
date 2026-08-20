const express = require("express");
const Appointment = require("../models/Appointment");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  
  try {
    const appointments = await Appointment.find({ owner: req.user.id}).sort({ scheduledFor: 1 });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  const appointment = await Appointment.create({
    doctor: req.body.doctor,
    reason: req.body.reason,
    scheduledFor: req.body.scheduledFor,
    owner: req.user.id,
  });
  res.status(201).json({ appointment })
});

router.put("/:id", async (req, res) => {
  try {
     const appointment = await Appointment.findByIdAndUpdate({
       _id: req.params.id,
       owner: req.user.id,
     },
     {
       doctor: req.body.doctor,
       reason: req.body.reason,
     },
     {
       new: true,
       runValidators: true,
     }
  );
     if(!appointment)
        return res.status(404).json({ message: "Not Found"});
    res.json({ appointment });
} 
  catch (error) {
    res.status(404).json({ message: error.message })
  }
});

router.delete("/:id", async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete({
    _id: req.params.id,
    owner: req.user.id,
  });
  if(!appointment)
    return res.status(404).json({ message: "Not Found "});
  res.json({ message: "Cancelled", id: req.params.id });
});

module.exports = router;
