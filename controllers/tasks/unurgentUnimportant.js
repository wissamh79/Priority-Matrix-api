const UnurgentUnimportant = require("../../models/tasks/UnurgentUnimportant");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../../errors");

const getAllUnurgentUnimportantTasks = async (req, res) => {
  const { search, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObject.search = { $regex: search, $options: "i" };
  }
  let result = UnurgentUnimportant.find(queryObject);

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

const getUnurgentUnimportantTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await UnurgentUnimportant.findOne({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
const createUnurgentUnimportantTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await UnurgentUnimportant.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};
const updateUnurgentUnimportantTask = async (req, res) => {
  const {
    body: { title },
    user: { userId },
    params: { id: taskId },
  } = req;
  if (title === "") {
    throw new BadRequestError("Title field can't be empty");
  }
  const task = await UnurgentUnimportant.findByIdAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
const deleteUnurgentUnimportantTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await UnurgentUnimportant.findByIdAndRemove({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};
module.exports = {
  getAllUnurgentUnimportantTasks,
  getUnurgentUnimportantTask,
  createUnurgentUnimportantTask,
  updateUnurgentUnimportantTask,
  deleteUnurgentUnimportantTask,
};
