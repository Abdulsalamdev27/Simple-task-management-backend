import bcrypt from "bcrypt";
import User from "../models/User.js"
import "dotenv/config";

export const signup = async(req, res)=>{
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
