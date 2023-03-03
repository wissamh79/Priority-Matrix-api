const express = require("express");

const router = express.Router();
const {
  getAllUnurgentUnimportantTasks,
  getUnurgentUnimportantTask,
  createUnurgentUnimportantTask,
  updateUnurgentUnimportantTask,
  deleteUnurgentUnimportantTask,
} = require("../../controllers/tasks/UnurgentUnimportant");

router
  .route("/")
  .post(createUnurgentUnimportantTask)
  .get(getAllUnurgentUnimportantTasks);
router
  .route("/:id")
  .get(getUnurgentUnimportantTask)
  .delete(deleteUnurgentUnimportantTask)
  .patch(updateUnurgentUnimportantTask);

module.exports = router;
