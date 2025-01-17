import { Router } from "express";
import { getAllUsers, getAllClients, getAllSPs, addUser, deleteUser, updateUser, getUserByUserName } from "../models/userModel.js";

const router = Router()

router.get("/", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.send(users);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
})

router.get("/client", async (req, res) => {
    try {
        const clients = await getAllClients();
        const filteredClients = clients.map(({_id, firstName, lastName, avgRating, username, quadrant, about, avatar}) => ({_id, firstName, lastName, avgRating, username, quadrant, about, avatar}))
        res.send(filteredClients);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
})

router.get("/mt", async (req, res) => {
    try {
        const mts = await getAllSPs();
        const filteredMTs = mts.map(({_id, firstName, lastName, avgRating, username, open, quadrant, avatar, licensed, services}) => ({_id, firstName, lastName, avgRating, username, open, quadrant, avatar, licensed, services}))
        res.send(filteredMTs);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
})

router.post("/", async (req, res) => {
    const newUser = req.body
    try {
      if(newUser.permission > 2) {
        newUser.permission = 2
      }
        const createUser = await addUser(newUser);
        res.send(createUser)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.delete("/", async(req, res) => {
  const user = req.body
  try {
    const deletedUser = await deleteUser(user)
    res.send(deletedUser)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
}
})

router.put("/", async(req,res) => {
   const user = req.body
   const username = user.username
  try {
    const updatedUser = await updateUser(username, user)
    res.send(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
}
})

export default router