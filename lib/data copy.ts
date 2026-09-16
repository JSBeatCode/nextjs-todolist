// [7단계 메모]
// - getTodos에 filter 파라미터를 추가했습니다. "필터링은 어디서 하는가?"가 이번 단계의 핵심 질문인데,
//   여기서는 서버(getTodos 내부)에서 필터링합니다. 클라이언트로 전체 목록을 다 보낸 뒤
//   브라우저에서 걸러내는 방식(client-side filter)도 가능하지만, 그러면 완료된 항목까지
//   불필요하게 네트워크로 전송하게 됩니다. 지금처럼 서버에서 걸러 보내는 게 일반적으로 더 낫습니다.

import { readTodos } from "./db";
import type { Todo } from "./types";

export type TodoFilter = "all" | "active" | "completed";

export async function getTodos(filter: TodoFilter = "all"): Promise<Todo[]> {
  const todos = await readTodos();
  const sorted = todos.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filter === "active") {
    return sorted.filter((todo) => !todo.completed);
  }
  if (filter === "completed") {
    return sorted.filter((todo) => todo.completed);
  }
  return sorted;
}

export async function getTodoById(id: string): Promise<Todo | undefined> {
  const todos = await readTodos();
  return todos.find((todo) => todo.id === id);
}
