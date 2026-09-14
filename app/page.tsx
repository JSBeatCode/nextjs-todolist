// [3단계 메모]
// - 이 컴포넌트는 async function 입니다. 일반 React 컴포넌트는 async일 수 없지만,
//   Server Component는 예외적으로 async를 지원합니다 (서버에서만 실행되기 때문).
//   → Vue2의 mixin에서 created()에 await axios.get(...) 하던 패턴이,
//      여기선 컴포넌트 함수 자체에서 그냥 await로 끝나는 셈입니다. 별도 loading 상태
//      변수를 직접 관리할 필요가 없습니다 (loading UI는 9단계 loading.tsx에서 다룹니다).
// - getTodos()는 lib/data.ts -> lib/db.ts를 거쳐 서버의 파일 시스템(db.json)을 읽습니다.
//   이 코드는 브라우저에서 절대 실행되지 않고, 결과 HTML만 브라우저로 전달됩니다.
// [7단계 메모]
// - searchParams도 Next.js 15+부터 Promise입니다. params와 마찬가지로 await로 풀어 씁니다.
// - URL이 "/?filter=active" 라면 searchParams.filter === "active" 로 들어옵니다.
// - 이 값을 getTodos(filter)에 그대로 넘겨서, 서버에서 이미 걸러진 목록만 TodoList로 전달합니다.
//   TodoList/TodoItem은 필터링 로직을 전혀 모릅니다 - "이미 걸러진 배열을 받아서 그릴 뿐"입니다.

import { getTodos, type TodoFilter } from "@/lib/data";
import TodoList from "@/components/TodoList";
import AddTodoForm from '@/components/AddTodoForm';
import FilterTabs from "@/components/FilterTabs";

type HomeProps = {
  searchParams: Promise<{ filter?: string }>;
}
export default async function Home({ searchParams }: HomeProps) {
  const { filter } = await searchParams;
  const validFilter: TodoFilter = filter === 'active' || filter === 'completed' ? filter : 'all';
  const todos = await getTodos(validFilter);

  return (
    <main>
      <h1>Todo App</h1>
      <AddTodoForm />
      <FilterTabs />
      <TodoList todos={todos} />
    </main>
  );
}