const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env");
const { validateInput } = require("../util/validateInput");
const User = require("../models/User");
const Topic = require("../models/Topic");
const bcrypt = require("bcrypt");

// check for same titles on the frontend;

async function registerUser(body) {
  const { name, email, description, topics, password } = body;
  await validateInput(body, "registerUser");

  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);
  const newUser = new User({
    name,
    email,
    description,
    password: hashedPassword,
  });
  const createdUser = await newUser.save();
  const existingTopics = await Topic.find({ name: { $in: topics } }).exec();
  const existingTopicIds = existingTopics.map((topic) => topic._id);
  const topicsToCreate = topics.filter(
    (topicName) =>
      !existingTopics.some((existingTopic) => existingTopic.name === topicName)
  );
  const newTopics = await Topic.insertMany(
    topicsToCreate.map((topicName) => ({ name: topicName }))
  );
  const createdTopicIds = newTopics.map((topic) => topic._id);
  const updatedUser = await User.findByIdAndUpdate(
    createdUser._id,
    { $push: { topics: { $each: [...existingTopicIds, ...createdTopicIds] } } },
    { new: true }
  ).exec();
  return createSession(updatedUser);
}

async function loginUser(body) {
  const user = validateInput(body, "loginUser");
  return createSession(user);
}

function createSession(user) {
  const userId = user._id.toString();
  const token = jwt.sign(userId, SECRET);

  const session = {
    userId,
    token,
  };
  return session;
}

module.exports = {
  registerUser,
  loginUser,
};
