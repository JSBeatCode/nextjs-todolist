// [3단계 메모]
// - 이 컴포넌트 상단에 "use client"가 없습니다 → 기본값 그대로 Server Component입니다.
// - Server Component는 서버에서 실행되어 완성된 HTML을 만들어 브라우저로 보냅니다.
//   즉, 이 파일 안의 JS 코드(map, 조건문 등)는 브라우저 번들에 포함되지 않습니다.
// - 아직 체크박스 클릭 등 "상호작용"은 없습니다. 그건 4단계에서 TodoItem을
//   별도 Client Component로 분리하며 추가할 예정입니다.
//   지금은 정적으로 데이터를 나열만 하는 상태를 먼저 눈으로 확인하는 게 목적입니다.

// 파일 경로 별칭(@/)을 사용해 정의된 Todo 타입과 자식 컴포넌트인 TodoItem을 가져옵니다.
import type { Todo } from "@/lib/types";
import TodoItem from "./TodoItem";

// TypeScript: 부모 컴포넌트로부터 전달받을 props의 타입을 정의합니다.
// Todo 객체 배열(Todo[])을 todos라는 속성으로 받아옵니다.
type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  // -----------------------------------------------------------------------------------
  // [Server Component 처리 로직]
  // - 아래 조건문과 map 연산은 클라이언트(브라우저)가 아닌 "서버"에서 미리 실행됩니다.
  // - 결과적으로 브라우저에는 완성된 HTML 태그(<p> 또는 <ul>)만 전달되므로
  //   초기 로딩 속도(FCP)가 빠르고 JavaScript 번들 크기를 줄일 수 있습니다.
  // -----------------------------------------------------------------------------------

  // 1. 예외 처리 (Early Return): 전달받은 todos 배열이 비어있는 경우
  if (todos.length === 0) {
    // 빈 상태의 제대로 된 UI(EmptyState, next/image)는 10단계에서 다룹니다.
    // 지금은 최소한의 안내 문구만 둡니다.
    return <p>할 일이 없습니다.</p>;
  }

  // 2. 목록 출력: todos 데이터가 존재할 때 <ul> 태그로 감싸서 리스트 생성
  return (
    <ul>
      {/* 
        Array.prototype.map()을 순회하며 todos 배열의 각 요소(todo)를 자식 컴포넌트로 변환합니다.
        
        [주석 처리된 이전 코드 메모]
        - 이전에 정적 JSX 요소(<li key={...}>)로 직접 그리던 방식에서,
        - 상호작용(체크박스 토글 등)을 전담할 자식 컴포넌트(<TodoItem />)로 분리했습니다.
        
        [key Prop의 중요성]
        - React가 리스트의 각 항목을 식별하고 효율적으로 업데이트(리렌더링)하기 위해
          고유한 식별자(`todo.id`)를 key prop으로 반드시 넘겨주어야 합니다.
      */}
      {todos.map((todo) => (
        // <li key={todo.id}>
        //   <input type="checkbox" checked={todo.completed} readOnly />
        //   <span style={{ marginLeft: 8 }}>{todo.title}</span>
        // </li>

        // Server Component(TodoList) 내부에서 Client Component(TodoItem)를 렌더링하는 핵심 패턴입니다.
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}