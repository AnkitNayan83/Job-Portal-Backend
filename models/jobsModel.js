import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "india",
    },
    desc: {
      type: String,
      required: true,
    },
    employer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
