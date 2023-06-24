const router = require("express").Router();
const {analyzeChats} = require("../controllers/chat-analyzer"); 
const auth = require("../middleware/authMiddleware");

router.route("/").get(auth,analyzeChats);


module.exports = router;