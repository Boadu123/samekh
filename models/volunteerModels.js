import {Schema, model} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const volunteerSchema = new Schema (
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        skills: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

volunteerSchema.plugin(toJSON)

export const volunteerModel = model("Volunteer", volunteerSchema)