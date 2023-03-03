const express = require("express");

const router = express.Router();
const {
  getAllUrgentImportantTasks,
  getUrgentImportantTask,
  createUrgentImportantTask,
  updateUrgentImportantTask,
  deleteUrgentImportantTask,
} = require("../../controllers/tasks/urgentImportant");

router
  .route("/")
  .post(createUrgentImportantTask)
  .get(getAllUrgentImportantTasks);
router
  .route("/:id")
  .get(getUrgentImportantTask)
  .delete(deleteUrgentImportantTask)
  .patch(updateUrgentImportantTask);

module.exports = router;
