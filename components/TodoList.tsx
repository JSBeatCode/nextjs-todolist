// [3단계 메모]
// - 이 컴포넌트 상단에 "use client"가 없습니다 → 기본값 그대로 Server Component입니다.
// - Server Component는 서버에서 실행되어 완성된 HTML을 만들어 브라우저로 보냅니다.
//   즉, 이 파일 안의 JS 코드(map, 조건문 등)는 브라우저 번들에 포함되지 않습니다.
// - 아직 체크박스 클릭 등 "상호작용"은 없습니다. 그건 4단계에서 TodoItem을
//   별도 Client Component로 분리하며 추가할 예정입니다.
//   지금은 정적으로 데이터를 나열만 하는 상태를 먼저 눈으로 확인하는 게 목적입니다.

import type { Todo } from "@/lib/types";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    // 빈 상태의 제대로 된 UI(EmptyState, next/image)는 10단계에서 다룹니다.
    // 지금은 최소한의 안내 문구만 둡니다.
    return <p>할 일이 없습니다.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        // <li key={todo.id}>
        //   <input type="checkbox" checked={todo.completed} readOnly />
        //   <span style={{ marginLeft: 8 }}>{todo.title}</span>
        // </li>
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}