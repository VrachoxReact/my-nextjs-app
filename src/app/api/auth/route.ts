import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
  } else {
    // User exists, verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ userId: user.id, token });
}
