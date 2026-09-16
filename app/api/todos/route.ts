// [8단계 메모]
// - 파일 경로 app/api/todos/route.ts 가 곧 "/api/todos" 엔드포인트입니다.
//   (app/page.tsx가 "/" 페이지가 되는 것과 같은 파일 기반 라우팅 규칙이, API에도 그대로 적용됩니다)
// - export하는 함수 이름이 HTTP 메서드입니다: GET, POST, PATCH, DELETE 등.
//   Express처럼 app.get('/api/todos', handler)를 별도로 등록할 필요가 없습니다.
// - 5단계의 Server Action(addTodo)과 이 POST 핸들러는 "같은 일"을 합니다
//   (readTodos -> 새 항목 추가 -> writeTodos -> revalidatePath). 로직이 겹치는 게 보이시죠.
//   차이는 "호출하는 방법"입니다:
//     - Server Action: <form action={addTodo}> 처럼 서버 함수를 직접 호출 (내부 UI 전용)
//     - Route Handler: fetch('/api/todos', { method: 'POST' }) 처럼 표준 HTTP로 호출
//       -> 외부 앱, 모바일 클라이언트, Postman 등 Next.js UI가 아닌 곳에서도 호출 가능
// - Request/Response는 Web 표준 Fetch API 객체입니다. Express의 req/res와 다릅니다.

import { NextResponse } from "next/server";
import { readTodos, writeTodos } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Todo } from "@/lib/types";

// GET /api/todos - 전체 목록 조회
export async function GET() {
  const todos = await readTodos();
  return NextResponse.json(todos);
}

// POST /api/todos - 새 todo 생성
// body 예시: { "title": "할 일 제목" }
export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const todos = await readTodos();
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  await writeTodos([...todos, newTodo]);
  revalidatePath("/");

  return NextResponse.json(newTodo, { status: 201 });
}
