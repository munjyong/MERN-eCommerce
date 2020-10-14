import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // signs the user id with secret key
  // expiration of the token set to 7 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
