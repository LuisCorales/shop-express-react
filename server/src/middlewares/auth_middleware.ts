import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/** Verify if the user already exists */
export async function verifyIfUserExists(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user === null) {
      req.body.userExist = false;
    } else {
      req.body.userExist = true;
      req.body.user = user;
    }

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token === undefined) throw new Error();

    jwt.verify(token, "secret", (err, user) => {
      if (err) throw err;
      req.body.user = user;
    });

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }
}
