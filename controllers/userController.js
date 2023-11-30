const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

const submitForm = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profession,
      city,
      gender,
      smoke,
      diet,
      drink,
      createFor,
      month,
      day,
      year,
      maritalStatus,
      height,
      country,
      religion,
      motherTongue,
      numberCode,
      mobile,
      address,
      follow,
    } = req.body;

    const saltRounds = 10;
    const hashedPassword = password;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Age filter
    function calculateAge(birthDate) {
      const today = new Date();
      const yearsDiff = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has occurred this year already
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        return yearsDiff - 1;
      }
      return yearsDiff;
    }

    const birthDate = new Date(year, month, day);
    const userAge = calculateAge(birthDate);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profession,
      city,
      gender,
      smoke,
      diet,
      drink,
      createFor,
      month,
      day,
      year,
      maritalStatus,
      height,
      country,
      religion,
      motherTongue,
      mobile,
      numberCode,
      address,
      age: userAge,
      follow,
    });

    await newUser.save();
    res.json({ status: true, userId: newUser._id });
  } catch (err) {
    console.log("Submit form", err);
    res.json({ status: false });
  }
};

const getRegistrationForm = async (req, res) => {
  try {
    const { gender } = req.body;
    const queryFilter = { gender: gender === "Male" ? "Female" : "Male" };

    const data = await User.find(queryFilter);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Get user data by ID

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

// Update single user

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user by ID and update their data
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Failed to update user." });
  }
};

//Filter data

const applyFilter = async (req, res) => {
  try {
    const { gender, maritalStatus, age, height, diet, smoke, drink } = req.body;

    const [minHeight, maxHeight] = height
      ? height.split(" - ").map(Number)
      : [undefined, undefined];

    const [minAge, maxAge] = age
      ? age.split(" - ").map(Number)
      : [undefined, undefined];

    const queryGender = gender === "Male" ? "Female" : "Male";
    const filter = { gender: queryGender };

    if (maritalStatus) filter.maritalStatus = maritalStatus;

    if (height && minHeight !== undefined && maxHeight !== undefined) {
      filter.height = { $gte: minHeight, $lte: maxHeight };
    }

    if (age && minAge !== undefined && maxAge !== undefined) {
      filter.age = { $gte: minAge, $lte: maxAge };
    }

    if (smoke && smoke !== "No Matter") {
      filter.smoke = smoke;
    }

    if (drink && drink !== "No Matter") {
      filter.drink = drink;
    }

    if (diet && diet !== "Both") {
      filter.diet = diet;
    }

    const data = await User.find(filter);
    res.json(data);
  } catch (err) {
    console.error("Error while filtering", err);
    res.status(500).json({ err: "Failed to filter" });
  }
};

// Update following

const updateFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { follow: !req.body.follow },
      { new: true }
    );
    // console.log(user.name);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error while follow status changes" });
  }
};

const loginUserRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  submitForm,
  getRegistrationForm,
  getCurrentUser,
  loginUserRegistration,
  updateUser,
  applyFilter,
  updateFollow,
};
