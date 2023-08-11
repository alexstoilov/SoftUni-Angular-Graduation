const {
  getAllUsers,
  subscribeToUser,
  getUserById,
} = require("../services/usersServices");
const { getUserIdFromToken } = require("../util/validateToken");
const usersController = require("express").Router();

// get all users
usersController.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get single user
usersController.get("/:id", async (req, res) => {
  try {
    // то хубаво, само че трябва да го вземеш от токена, защото сега това е адреса на статията, не на юзъра
    const userId = await getUserIdFromToken(req.headers.authorization);
    const user = await getUserById(userId);
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
usersController.get("/current", async (req, res) => {
  try {
    // то хубаво, само че трябва да го вземеш от токена, защото сега това е адреса на статията, не на юзъра
    const userId = await getUserIdFromToken(req.headers.authorization);
    const user = await getUserById(userId);
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// subscribe to user
usersController.post("/:id/subscribe", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    const success = await subscribeToUser(req.params.id, userId);
    if (success) {
      return res.status(200).json({ message: "Subscribed successfully" });
    } else {
      return res.status(500).json({ error: "Subscription failed" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

module.exports = usersController;
