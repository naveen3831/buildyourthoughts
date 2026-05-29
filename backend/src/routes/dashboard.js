const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/stats", ctrl.getStats);
router.get("/activity", ctrl.getActivity);
router.get("/projects", ctrl.getProjects);
router.get("/messages", ctrl.getMessages);
router.patch("/messages/:id", ctrl.updateMessage);

module.exports = router;
