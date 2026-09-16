import { NextResponse } from "next/server";
import { readTodos, writeTodos } from "@/lib/db";
import { getTodoById } from "@/lib/data";
import { revalidatePath } from "next/cache";

// [id]에 들어온 URL 파라미터의 타입
// 예: /api/todos/123 -> id는 "123"
type RouteContext = {
  params: Promise<{id: string}>
}

// GET /api/todos/:id
// URL의 id에 해당하는 Todo 1개를 조회한다.
export async function GET(_request: Request, { params }: RouteContext) {
  // [id] 값을 꺼낸다.
  const { id } = await params;

  // id로 Todo 1개를 조회한다.
  const todo = await getTodoById(id);

  // Todo가 없으면 404 응답을 반환한다.
  if (!todo) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // 찾은 Todo를 JSON으로 반환한다.
  return NextResponse.json(todo);
}

// PATCH /api/todos/:id
// URL의 id에 해당하는 Todo를 수정한다.
export async function PATCH(request: Request, { params }: RouteContext) {
  // [id] 값을 꺼낸다.
  const { id } = await params;

  // 요청 body를 JSON 객체로 변환한다.
  const body = await request.json();

  // 현재 저장된 전체 Todo를 읽는다.
  const todos = await readTodos();

  // 수정하려는 Todo가 실제로 존재하는지 찾는다.
  const target = todos.find((todo) => todo.id === id);

  // Todo가 없으면 404 응답을 반환한다.
  if (!target) {
    return NextResponse.json({ error: 'not found' }, {status:404})
  }

  // 전체 Todo를 순회하면서 id가 같은 Todo만 수정한다.
  const updated = todos.map((todo) =>
    todo.id === id ?
      {
        // 기존 Todo의 속성을 그대로 복사한다.
        ...todo,

        // completed가 boolean이면 completed 값을 변경한다.
        // 조건이 false이면 이 부분은 추가되지 않는다.
        ...(typeof body?.completed === 'boolean' && { completed: body.completed }),

        // title이 문자열이고 trim() 결과가 비어있지 않으면 title을 변경한다.
        // 예: "  공부하기  " -> "공부하기"
        ...(typeof body?.title === 'string' && body.title.trim() && { title: body.title.trim() })
      } : todo);

  // 수정된 전체 Todo를 저장한다.
  await writeTodos(updated);

  // Todo 목록을 사용하는 메인 페이지의 캐시를 갱신한다.
  revalidatePath('/')

  // 해당 Todo 상세 페이지의 캐시도 갱신한다.
  revalidatePath(`/todos/${id}`);

  // 수정된 Todo를 JSON으로 반환한다.
  return NextResponse.json(updated.find((todo) => todo.id === id))
}

// DELETE /api/todos/:id
// URL의 id에 해당하는 Todo를 삭제한다.
export async function DELETE(_request: Request, { params }: RouteContext) {
  // [id] 값을 꺼낸다.
  const { id } = await params;

  // 현재 저장된 전체 Todo를 읽는다.
  const todos = await readTodos();

  // 삭제하려는 Todo가 실제로 존재하는지 확인한다.
  // some()은 조건을 만족하는 Todo가 하나라도 있으면 true를 반환한다.
  if (!todos.some((todo)=>todo.id === id)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  // 삭제하려는 id를 제외한 Todo만 남긴다.
  const updated = todos.filter((todo) => todo.id !== id)

  // 삭제된 결과를 저장한다.
  await writeTodos(updated)

  // Todo 목록을 사용하는 메인 페이지의 캐시를 갱신한다.
  revalidatePath('/')

  // HTTP 204는 요청은 성공했지만 응답할 데이터가 없다는 의미다.
  return new NextResponse(null, {status: 204})
}
