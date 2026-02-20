import Task from "../models/Task.js";
import User from "../models/User.js";


export const createTask = async (req, res) => {
    try {
        const myId = req.user._id;
        const { title, description, status, priority, dueDate } = req.body;

        if (!title || !description) {
            return res.status(401).json({
                message: "Title and description are required"
            });
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: myId 
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating task",
            error: error.message
        });
    }
};

export const viewAllTask = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const getAllTask = await Task.find({ userId: loggedInUserId });

        res.status(200).json(getAllTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const viewTaskById = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;

        const task = await Task.findOne({ _id: id, userId: myId });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        console.log("Error in viewTaskById controller:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteTaskById = async (req, res) =>{
    try{
        const myId = req.user._id;
        const { id} = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: myId })

        if(!task){
            res.status(404).json({message: "Task not found or not authorized"})
        }

        res.status(200).json({
            message: "Task deleted successfully"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }

}

export const updateTaskById = async (req, res) =>{
    try{
        const myId = req.user._id;
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: myId },
            { title, description, status, priority, dueDate },
            { new: true }
        );

        if(!task){
            return res.status(404).json({
                message: "Task not found or not authotized"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }


};

