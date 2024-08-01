import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { title, userId } = await request.json();
  const newTodo = await prisma.todo.create({
    data: { title, userId },
  });
  return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, completed, title } = await request.json();
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed, title },
  });
  return NextResponse.json(updatedTodo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") as string);
  await prisma.todo.delete({
    where: { id },
  });
  return new NextResponse(null, { status: 204 });
}
