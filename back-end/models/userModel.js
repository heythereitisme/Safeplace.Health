import mongoose from "../mongoose.js";
import { auth } from "../server.js";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    permission: {type: Number, required: true, default: 1},
    avgRating: {type: Number, default: 0},
    username: {type: String, required: true, unique: true},
    uid: {type: String, required: true, unique: true},
    licensed: {reg: Boolean, date: Date},
    phoneNumber: String,
    quadrant: [{ type: String}],
    about: String,
    address: String,
    avatar: {type: String, default: "/Default_pfp.svg"},
    open: {type: Boolean, default: false},
    services: [{type: String}]
})

const User = mongoose.model("Users", userSchema,)

export const getAllUsers = async() => {
    const users = await User.find()
    console.log("All users sent")
    return users
}

export const getAllClients = async() => {
    const users = await User.find({permission: 1})
    console.log("Clients sent")
    return users
}

export const getUserByUserName = async(u) => {
    const user = await User.findOne({username: u})
    console.log("Found user", user.username)
    return user
}

export const getAllSPs = async() => {
    const users = await User.find({permission: 2})
    console.log("MTs sent")
    return users
}

export const addUser = async({permission, firstName, lastName, username, token, quadrant}) => {
    const verify = await auth.verifyIdToken(token)
    const uid = verify.uid
    const u = {permission, firstName, lastName, username, uid, quadrant}
    const user = await User.create(u)
    console.log(user.firstName, "added")
    return user
}

export const updateRating = async(u, r) => {
    const updatedScore = await User.findOneAndUpdate({_id: u},
        {avgRating: r},
        {new: true}
        )
    console.log("updated rating:", updatedScore.avgRating)
    return updatedScore.avgRating
}

export const deleteUser = async(u) => {
    const removedUser = await User.deleteOne(u)
    console.log("removed user!")
    return removedUser
}

export const updateUser = async(username, u) => {
    const updatedUser = await User.findOneAndUpdate({username: username}, u)
    console.log("Updated user!")
    return {message: `${updatedUser.username} updated!`}
}