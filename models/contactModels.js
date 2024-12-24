import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.plugin(toJSON);

export const contactModel = model("Contact", contactSchema);
