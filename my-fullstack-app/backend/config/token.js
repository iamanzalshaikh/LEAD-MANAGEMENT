import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", 
      }
    );
    console.log(token, "Token is here"); 
    return token; 
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

export default genToken;
