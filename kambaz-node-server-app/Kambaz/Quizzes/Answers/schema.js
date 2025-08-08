// Answer schema for quiz submissions
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  // TODO: Switch to ObjectId reference when we refactor the quiz model
  quizId: { type: String },
  userId: { type: String, ref: "UserModel"   },
  answers: [
    {
      questionId: { type: String, ref: "QuestionModel" },
      answer: mongoose.Schema.Types.Mixed,
    }
  ],
  score: Number,
  attemptDate: { type: Date, default: Date.now },
});

export default answerSchema;