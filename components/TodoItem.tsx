"use client";
// [4단계 메모]
// - 파일 최상단의 "use client" 지시어가 핵심입니다.
//   이걸 붙이는 순간 이 컴포넌트(와 그 안에서 쓰는 함수들)는 브라우저 번들에 포함되고,
//   브라우저에서 실행됩니다. useState, onClick 같은 "상호작용"은 Client Component에서만 가능합니다.
// - 반대로 3단계에서 만든 TodoList.tsx는 "use client"가 없으므로 여전히 Server Component입니다.
//   → 하나의 화면 안에 Server Component(TodoList)와 Client Component(TodoItem)가 공존합니다.
//   이게 App Router의 핵심 패턴입니다: "상호작용이 필요한 최소 단위만 Client로 내린다."
// - 지금 체크박스를 클릭하면 화면은 바뀌지만, 새로고침하면 원래 상태로 돌아옵니다.
//   왜냐하면 이 useState는 "이 컴포넌트 안에서만" 기억되는 로컬 상태이고,
//   서버의 db.json에는 아직 반영되지 않기 때문입니다.
//   → 실제로 서버에 저장하는 로직(Server Action)은 5단계에서 연결합니다.

import { useState } from "react";
import type { Todo } from "@/lib/types";
import styles from "./TodoItem.module.css";

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  // 서버에서 받은 초기값(todo.completed)으로 로컬 state를 시작.
  // Vue2로 치면 props로 받은 값을 data()의 초기값으로 복사해 쓰는 것과 같은 패턴입니다.
  const [completed, setCompleted] = useState(todo.completed);

  function handleToggle() {
    setCompleted((prev) => !prev);
    // TODO(5단계): 여기서 서버 액션(toggleTodo)을 호출해 db.json에도 반영할 예정.
  }

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        className={styles.checkbox}
      />
      <span className={completed ? styles.titleDone : styles.title}>
        {todo.title}
      </span>
    </li>
  );
}