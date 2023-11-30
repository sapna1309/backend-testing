const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserData = require("../models/userModel");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token.replace("Bearer ", ""), "ash_it", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    const { userId, name, email, gender } = decoded;

    req.body.userId = userId;
    req.body.name = name;
    req.body.email = email;
    req.body.gender = gender;
    // req.user = decoded
    next();
  });
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = user.password;
    // const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
      },
      "ash_it",
      {
        expiresIn: "1h",
      }
    );

    console.log("User logged in:", user.email);

    res.json({
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { verifyToken, loginUser };
