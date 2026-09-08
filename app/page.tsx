// [3단계 메모]
// - 이 컴포넌트는 async function 입니다. 일반 React 컴포넌트는 async일 수 없지만,
//   Server Component는 예외적으로 async를 지원합니다 (서버에서만 실행되기 때문).
//   → Vue2의 mixin에서 created()에 await axios.get(...) 하던 패턴이,
//      여기선 컴포넌트 함수 자체에서 그냥 await로 끝나는 셈입니다. 별도 loading 상태
//      변수를 직접 관리할 필요가 없습니다 (loading UI는 9단계 loading.tsx에서 다룹니다).
// - getTodos()는 lib/data.ts -> lib/db.ts를 거쳐 서버의 파일 시스템(db.json)을 읽습니다.
//   이 코드는 브라우저에서 절대 실행되지 않고, 결과 HTML만 브라우저로 전달됩니다.

import { getTodos } from "@/lib/data";
import TodoList from "@/components/TodoList";

export default async function Home() {
  const todos = await getTodos();

  return (
    <main>
      <h1>Todo App</h1>
      <TodoList todos={todos} />
    </main>
  );
}