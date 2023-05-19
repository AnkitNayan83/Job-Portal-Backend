import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
