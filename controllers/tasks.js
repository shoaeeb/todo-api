const Task = require("../models/tasks");

const getAllTasks = async (req, res) => {
  try {
    const Tasks = await Task.find({});
    res.status(200).json({ msg: "success", Tasks });
  } catch (error) {
    res.status(500).json({ msg: error, Tasks: [] });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ msg: "Task Created" });
    // res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ msg: `No task with id : ${id}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id });
    if (!task) {
      return res.status(404).json({ msg: `No task with id : ${id}` });
    }
    res.status(200).json({ msg: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { name, completed } = req.body;

    const { id } = req.params;

    const task = await Task.findOneAndUpdate({ _id: id }, { name, completed });
    if (!task) {
      return res.status(404).json({ msg: `No task with id : ${id}` });
    }
    res.status(200).json({ msg: "Task Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
  getTask,
  updateTask,
};
