const express = require("express");

const router = express.Router();
const {
  getAllUnurgentImportantTasks,
  getUnurgentImportantTask,
  createUnurgentImportantTask,
  updateUnurgentImportantTask,
  deleteUnurgentImportantTask,
} = require("../../controllers/tasks/UnurgentImportant");

router
  .route("/")
  .post(createUnurgentImportantTask)
  .get(getAllUnurgentImportantTasks);
router
  .route("/:id")
  .get(getUnurgentImportantTask)
  .delete(deleteUnurgentImportantTask)
  .patch(updateUnurgentImportantTask);

module.exports = router;
