const User = require("../models/user.model");
const { InternalServerError, NotFound } = require("../errors");
const jwt = require('jsonwebtoken');


class AuthRepo {
    async register(userData) {
        try {
            const { username, email, password } = userData;


            const existingUser = await User.findOne({ email });

            if (existingUser) {

                const isMatch = await existingUser.comparePassword(password);

                if (isMatch) {

                    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

                    return {
                        token,
                        user: {
                            id: existingUser._id,
                            username: existingUser.username,
                            email: existingUser.email
                        },
                        isNewUser: false
                    };
                } else {

                    return {
                        userExists: true,
                        isNewUser: false
                    };
                }
            }


            const user = new User({ username, email, password });
            await user.save();


            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });


            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                isNewUser: true
            };

        } catch (error) {
            console.log(error);
            throw new InternalServerError(error.message);
        }
    }


    async login(userData) {
        try {
            console.log(userData);
            const { email, password } = userData;

            const user = await User.findOne({ email });
            if (!user) {
                return { userNotFound: true };
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return { invalidPassword: true };
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerError(error.message);
        }
    }
    
    async updateUser(userId, userData){
        try{
            const {username, profileImage} = userData;
            let user;

            if(username && profileImage){
                user = await User.findByIdAndUpdate(userId, {username, profileImage}, {new: true});
            }
            else if(username){
                user = await User.findByIdAndUpdate(userId, {username}, {new: true});
            }
            else{
                user = await User.findByIdAndUpdate(userId, {profileImage}, {new: true});
            }

            console.log(user);
            if(!user){
                throw new NotFound("User", userId);
            }

            return user;
        }
        catch(err){
            console.log(err);
            throw new InternalServerError(err.message);
        }
    }
}

module.exports = AuthRepo;