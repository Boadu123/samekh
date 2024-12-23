import {Schema, model} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema (
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
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(toJSON)

export const userModel = model("User", userSchema)