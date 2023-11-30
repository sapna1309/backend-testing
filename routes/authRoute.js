const express = require("express");
const router = express.Router();
const { verifyToken, loginUser } = require("../controllers/authController");
const { loginUserRegistration } = require("../controllers/userController");

router.get("/verify-token", verifyToken, (req, res) => {
  const userData = req.body;
  // console.log("USER", userData)
  res.json({ user: userData });
});

router.post("/login", loginUser);
router.post("/login-registration", loginUserRegistration);

module.exports = router;
