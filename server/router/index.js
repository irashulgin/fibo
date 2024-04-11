const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const invitationController = require("../controllers/invintation-controller");
const companyController = require("../controllers/company-controller");
const challengesController = require("../controllers/challenges-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const authRoleMiddleware = require("../middlewares/auth-role-middleware");

router.post(
  "/registration",
  // body('email').isEmail(),
  // body('password').isLength({min:3,max:32}),
  // body('name').isString(),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("/activate/:link", userController.activate);
router.post("/reset-password", userController.resetPassword);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);

router.post("/forgot-password", userController.forgotPassword);
router.get("/check-reference/:reference", userController.checkReference);
router.post("/invite-user", userController.inviteUser);

 
router.get("/challenges", challengesController.get);
router.post("/add-challenge", challengesController.addChallenge);

router.post("/send-invitation", invitationController.sendInvitation);
router.get("/accept-invitation/:link", invitationController.acceptInvitation);
router.post("/collect", userController.collectData);
router.post("/update-user",userController.updateUser);
// Set up multer for handling file uploads
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/upload", upload.single("file"), userController.saveFile);
router.get("/images/:filename", userController.getFile);
router.post("/create-company", companyController.createCompany);

module.exports = router;
