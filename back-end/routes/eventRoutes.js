import { Router } from "express";
import {
  addNewEvent,
  deleteEvent,
  getBookingEvents,
  updateEvent,
  getUserEvents
} from "../models/eventsModel.js";

const router = Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const events = await getBookingEvents(id);
    res.send(events);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/mt/:id", async (req, res) => {
  const id = req.params.id
  try {
    const events = await getUserEvents(id);
    res.send(events);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const event = req.body;
    const newEvent = await addNewEvent(event);
    res.send(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.patch("/", async (req, res) => {
  try {
    const event = req.body;
    const updatedEvent = await updateEvent(event);
    res.send(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const event = req.body;
    const deletedEvent = await deleteEvent(event);
    res.send(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
