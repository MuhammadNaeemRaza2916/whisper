import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // get user info from clerk and save to db
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
      if (!primaryEmail) {
        res.status(422).json({ message: "Unable to provision user without email" });
        return;
      }

      const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
      const name = fullName || primaryEmail.split("@")[0];

      try {
        user = await User.create({
          clerkId,
          name,
          email: primaryEmail,
          avatar: clerkUser.imageUrl,
        });
      } catch (err: any) {
        if (err?.code === 11000) {
          user = await User.findOne({ clerkId });
        } else {
          throw err;
        }
      }
    }

    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}