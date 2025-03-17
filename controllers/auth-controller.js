const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// sign up
const signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
  
      // hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // create and save user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      res.json({ success: true, message: "User registered successfully!" });
    }
     catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
// sign in
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// sign out
const signout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "User signed out successfully!" });
};


module.exports = { signup, signin, signout };
