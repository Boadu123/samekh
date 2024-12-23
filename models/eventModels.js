import { Schema, Types, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const eventSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    location: {
      type: String,
    },
    image: [{
      type: String,
    }],
    organizer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.plugin(toJSON);

export const eventModel = model("Event", eventSchema);
