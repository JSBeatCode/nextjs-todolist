// [3단계 메모]
// - lib/db.ts 가 "파일에서 읽고 쓰는 법"을 안다면,
//   이 파일 lib/data.ts 는 "화면(컴포넌트)에 어떤 형태로 데이터를 내려줄지"를 담당합니다.
// - 지금은 db.ts를 그대로 감싸는 정도지만, 나중에(4장 심화) 여기에
//   - 정렬/가공 로직
//   - 외부 API였다면 fetch(url, { next: { revalidate: 60 } }) 같은 캐싱 옵션
//   을 추가하게 됩니다. 지금 우리는 로컬 파일(fs)이라 fetch 캐싱 옵션은 해당 없고,
//   대신 Next.js의 또 다른 캐싱 도구인 unstable_cache / revalidatePath를 5단계에서 다룹니다.
// - 컴포넌트(TodoList 등)는 db.ts를 직접 import하지 않고 항상 이 파일을 거칩니다.
//   → "화면은 데이터가 어디서 오는지 몰라도 된다"는 계층 분리 원칙.

import { readTodos } from "./db";
import type { Todo } from "./types";

// 전체 목록 조회
export async function getTodos(): Promise<Todo[]> {
  const todos = await readTodos();
  // 최신순 정렬 - 이런 "화면에 보여줄 형태로 가공"하는 책임이 data.ts의 역할입니다.
  return todos.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// id로 단건 조회 (6단계 상세 페이지에서 사용 예정 - 지금 미리 만들어둠)
export async function getTodoById(id: string): Promise<Todo | undefined> {
  const todos = await readTodos();
  return todos.find((todo) => todo.id === id);
}