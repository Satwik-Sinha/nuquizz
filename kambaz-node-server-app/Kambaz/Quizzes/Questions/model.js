// Question model for database operations
import mongoose from "mongoose";
import schema from "./schema.js";
const questionModel = mongoose.model("Question", schema, "questions");
export default questionModel;