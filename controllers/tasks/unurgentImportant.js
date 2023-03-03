const UnurgentImportant = require("../../models/tasks/UnurgentImportant");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../../errors");

const getAllUnurgentImportantTasks = async (req, res) => {
  const { search, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObject.search = { $regex: search, $options: "i" };
  }
  let result = UnurgentImportant.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-cratedAt");
  }
  if (sort === "oldest") {
    result = result.sort("cratedAt");
  }
  if (sort === "a-z") {
    result = result.sort("search");
  }
  if (sort === "z-a") {
    result = result.sort("-search");
  }

  const tasks = await result;

  res.status(StatusCodes.OK).json({
    tasks,
  });
};

const getUnurgentImportantTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await UnurgentImportant.findOne({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
const createUnurgentImportantTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await UnurgentImportant.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};
const updateUnurgentImportantTask = async (req, res) => {
  const {
    body: { title },
    user: { userId },
    params: { id: taskId },
  } = req;
  if (title === "") {
    throw new BadRequestError("Title field can't be empty");
  }
  const task = await UnurgentImportant.findByIdAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
const deleteUnurgentImportantTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await UnurgentImportant.findByIdAndRemove({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
module.exports = {
  getAllUnurgentImportantTasks,
  getUnurgentImportantTask,
  createUnurgentImportantTask,
  updateUnurgentImportantTask,
  deleteUnurgentImportantTask,
};
