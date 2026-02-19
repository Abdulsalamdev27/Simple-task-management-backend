import bcrypt from "bcrypt";
import User from "../models/User.js"
import "dotenv/config";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res)=>{
    const { fullName, email, password } = req.body;

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        if(password.lenght < 6){
            return res.status(400).json({
                message:"Password must be at least 6 characters"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Invalid email formal"
            });
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({
            message:"Email already exists"
        })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            const savedUser = await newUser.save();

            // Convert to object and remove password
            const userResponse = savedUser.toObject();
            delete userResponse.password;

            res.status(201).json({
                user: userResponse,
                message: "User created successfully. Please login."
            });

        } else {
            res.status(400).json({
                message: "Invalid user data"
            });
        }

        // const savedUser = await newUser.save();
        // res.status(201).json({
        //     user: newUser,
        //     message: "user created successfully"})


    }catch(error){
        console.log("Error in signup controller:", error);
        res.status(500).json({
            message:"Internal server error"
        })

    }

}

export const login = async (req, res)=>{
    const { email, password } = req.body;
    
    if(!email || !password){
        res.status(400).json({
            message: "Email and password are required"
        });
    }

    try{
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({
            message: "Invaild credentials"
        });

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({
            message: "Invaild credentials"
        });

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            message: `welcome back ${user.fullName}` ,
        })



    }catch(error){
        console.log("Error in login controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });

    }

}
