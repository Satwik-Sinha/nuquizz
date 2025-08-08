// Question schema for quiz questions
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String },
  // TODO: Switch to ObjectId reference when we refactor the quiz model
  quizId: { type: String, ref: "QuizModel", required: true },
  title: String,
  text: String,
  type: String, // Question types: 'True/False', 'Multiple Choice', 'Fill in the Blank'
  choices: [String], // For multiple choice questions only
  correctAnswer: mongoose.Schema.Types.Mixed,
  points: Number,
});

export default questionSchema;