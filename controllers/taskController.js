const Task = require("../models/Task");

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const task = new Task({ ...req.body, user: req.user.id });
        await task.save();
        req.io.emit("taskUpdate");
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: "Task not found" });

        req.io.emit("taskUpdate");
        res.json(task);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        req.io.emit("taskUpdate");
        res.json({ message: "Task deleted" });
    } catch (error) {
        next(error);
    }
};
