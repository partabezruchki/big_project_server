const authController = require("../controllers/auth.controller");

const router = require("express").Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 30 }),
  body("name").isLength({ min: 2 }),
  authController.register
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 30 }),
  authController.login
);
router.get("/activate/:id", authController.activation);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/me", authMiddleware, authController.getMe);
module.exports = router;
