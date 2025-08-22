import bcrypt from "bcrypt";
import User from "../model/userModel.js";
// import validator from "validator";
import genToken from "../config/token.js";
import Salesperson from "../model/salesModel.js";


// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    //  if (!validator.isEmail(email)) {
    //   return res.status(400).json({ message: "Enter a valid email" });
    // }

    if (password.length < 6) {
      return res.status(400).json({ message: "Enter a stronger password (min 6 chars)" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

  
    const user = await User.create({ name, email, password: hashedPassword, role });

 if (role === "salesman") {
      await Salesperson.create({
        name,
        email,
        active_leads_count: 0,
        total_leads_handled: 0,
        successful_conversions: 0,
        success_rate: 0,
      });
    }


    const token = genToken(user._id);

   
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
     console.error("Signup error:", error); 
    return res.status(500).json({ message: `signup error: ${error.message}` });  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);


    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout error" });
  }
};
