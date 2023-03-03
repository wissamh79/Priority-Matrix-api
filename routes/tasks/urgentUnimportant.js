const express = require("express");

const router = express.Router();
const {
  getAllUrgentUnimportantTasks,
  getUrgentUnimportantTask,
  createUrgentUnimportantTask,
  updateUrgentUnimportantTask,
  deleteUrgentUnimportantTask,
} = require("../../controllers/tasks/urgentUnimportant");

router
  .route("/")
  .post(createUrgentUnimportantTask)
  .get(getAllUrgentUnimportantTasks);
router
  .route("/:id")
  .get(getUrgentUnimportantTask)
  .delete(deleteUrgentUnimportantTask)
  .patch(updateUrgentUnimportantTask);

module.exports = router;
