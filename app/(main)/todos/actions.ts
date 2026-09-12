"use server";
// [5단계 메모]
// - 파일 최상단의 "use server"가 핵심입니다. 이걸 붙이면 이 파일의 export된 함수들은
//   "Server Action"이 됩니다: 클라이언트 컴포넌트에서 마치 로컬 함수처럼 import해서 호출하지만,
//   실제로는 서버에서만 실행됩니다 (fetch나 API 엔드포인트를 직접 만들 필요 없이 RPC처럼 동작).
// - (main)은 라우트 그룹입니다. 폴더명에 괄호를 쓰면 URL 경로에는 전혀 영향을 주지 않고,
//   순수하게 파일 구조 정리용으로만 쓰입니다. 이 파일이 여기 있어도 "/main/todos/..." 같은
//   URL은 생기지 않습니다.
// - revalidatePath("/")는 "/" 라우트의 캐시된 렌더링 결과를 무효화합니다.
//   3단계에서 "/"가 빌드 시 정적으로 구워졌던 걸 확인했는데, 이 함수를 호출하면
//   Next.js가 다음 요청 때 app/page.tsx(Server Component)를 다시 실행해서 최신 데이터로 갱신합니다.
//   → Vuex의 mutation 이후 화면이 자동 갱신되던 것과 비슷한 효과를, 서버 중심으로 만들어냅니다.

import { readTodos, writeTodos } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Todo } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 새 todo 추가.
// <form action={addTodo}> 형태로 쓰이므로 첫 인자로 FormData를 받습니다.
export async function addTodo(formData: FormData): Promise<void> {

  await delay(2000);

  const title = (formData.get("title") as string | null)?.trim();
  if (!title) {
    // 빈 값 제출은 조용히 무시. (사용자 입력 검증 UI는 이번 단계 범위 밖)
    return;
  }

  const todos = await readTodos();
  const newTodo: Todo = {
    id: crypto.randomUUID(), // Node.js 내장 crypto - 별도 라이브러리 없이 고유 id 생성
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  await writeTodos([...todos, newTodo]);
  revalidatePath("/");
}

// 완료 상태 토글.
export async function toggleTodo(id: string): Promise<void> {
  const todos = await readTodos();
  const updated = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  await writeTodos(updated);
  revalidatePath("/");
}

// 삭제.
export async function deleteTodo(id: string): Promise<void> {
  const todos = await readTodos();
  const updated = todos.filter((todo) => todo.id !== id);

  await writeTodos(updated);
  revalidatePath("/");
}

// 제목 수정 (현재 UI에는 아직 연결하지 않음 - CRUD 세트를 갖춰두기 위해 미리 작성)
export async function updateTodo(id: string, title: string): Promise<void> {
  const trimmed = title.trim();
  if (!trimmed) return;

  const todos = await readTodos();
  const updated = todos.map((todo) =>
    todo.id === id ? { ...todo, title: trimmed } : todo
  );

  await writeTodos(updated);
  revalidatePath("/");
}