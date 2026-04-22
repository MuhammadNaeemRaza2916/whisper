import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId | null;
  lastMessageAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      validate: [
        {
          validator: (ids: mongoose.Types.ObjectId[]) => ids.length >= 2,
          message: "Chat must include at least 2 participants",
        },
        {
          validator: (ids: mongoose.Types.ObjectId[]) =>
            new Set(ids.map(String)).size === ids.length,
          message: "Participants must be unique",
        },
      ],
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", ChatSchema);