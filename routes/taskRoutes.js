const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validation");
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/getTask", auth, taskController.getTasks);

router.post(
    "/createTask",
    auth,
    validate([
        body("title").notEmpty().withMessage("Title is required"),
        body("priority").optional().isIn(["Low", "Medium", "High"]),
        body("due_date").optional().isISO8601(),
    ]),
    taskController.createTask
);

router.put(
    "/updateTask/:id",
    auth,
    validate([param("id").isMongoId().withMessage("Invalid Task ID")]),
    taskController.updateTask
);

router.delete(
    "/deleteTask/:id",
    auth,
    validate([param("id").isMongoId().withMessage("Invalid Task ID")]),
    taskController.deleteTask
);

module.exports = router;
