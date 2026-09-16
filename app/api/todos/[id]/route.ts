import { NextResponse } from "next/server";
import { readTodos, writeTodos } from "@/lib/db";
import { getTodoById } from "@/lib/data";
import { revalidatePath } from "next/cache";

type RouteContext = {
  params: Promise<{id: string}>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const todo = await getTodoById(id);

  if (!todo) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json(todo);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  const todos = await readTodos();
  const target = todos.find((todo) => todo.id === id);

  if (!target) {
    return NextResponse.json({ error: 'not found' }, {status:404})
  }
  // ???
  const updated = todos.map((todo) =>
    todo.id === id ?
      {
        ...todo,
        ...(typeof body?.completed === 'boolean' && { completed: body.completed }),
        ...(typeof body?.title === 'string' && body.title.trim() && { title: body.title.trim() })
      } : todo);

  await writeTodos(updated);
  revalidatePath('/')
  revalidatePath(`/todos/${id}`);

  return NextResponse.json(updated.find((todo) => todo.id === id))
}

// ???
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const todos = await readTodos();

  if (!todos.some((todo)=>todo.id === id)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const updated = todos.filter((todo) => todo.id !== id)
  await writeTodos(updated)
  revalidatePath('/')
  // ???
  return new NextResponse(null, {status: 204})
}
