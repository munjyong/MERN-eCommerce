import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("password"),
    isAdmin: true,
  },
  {
    name: "Edmund",
    email: "edmund@example.com",
    password: bcrypt.hashSync("password"),
  },
  {
    name: "Maggie",
    email: "maggie@example.com",
    password: bcrypt.hashSync("password"),
  },
];

export default users;
