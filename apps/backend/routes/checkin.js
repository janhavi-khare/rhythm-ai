const express = require("express");

const router = express.Router();

const {
  submitCheckIn,
} = require("../services/checkInService");

router.post("/:userId", async (req, res) => {
  try {
    const result = await submitCheckIn(
      req.params.userId,
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;