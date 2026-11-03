const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: false,
  saveUninitialized: false
}));

app.use("/customer/auth", function auth(req,res,next){
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (token) {
    try {
      req.user = jwt.verify(token, "fingerprint_customer");
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else if (req.session.user) {
    req.user = { username: req.session.user };
  } else {
    return res.status(401).json({ message: "Authentication required" });
  }

  next();
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
