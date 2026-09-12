"use client";
// [5단계 메모]
// - 4단계에서는 체크박스가 로컬 state만 바꾸고 새로고침하면 원상복구됐습니다.
//   이제 toggleTodo(Server Action)를 실제로 호출해서 db.json에도 반영합니다.
// - Server Action(toggleTodo, deleteTodo)을 Client Component 안에서 그냥 일반 함수처럼
//   import해서 호출할 수 있다는 게 포인트입니다.
// - useTransition으로 감싼 이유: 서버 응답을 기다리는 동안 UI가 멈추지 않게 하고,
//   isPending으로 "처리 중" 상태를 표시하기 위함입니다.
// - 먼저 setCompleted로 화면을 낙관적으로(optimistic) 바꾸고, 그 다음 서버에 반영합니다.

import { useState, useTransition } from "react";
import type { Todo } from "@/lib/types";
import { toggleTodo, deleteTodo } from "@/app/(main)/todos/actions";
import styles from "./TodoItem.module.css";

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  // 체크박스 클릭 시 화면 UI를 즉시 바꾸기 위한 로컬 상태 (낙관적 업데이트용)
  const [completed, setCompleted] = useState(todo.completed);

  // useTransition: 백그라운드 작업 처리 및 렉(UI 멈춤) 방지를 위한 React Hook
  // - isPending (boolean): 백그라운드 작업이 진행 중인지 여부 (진행 중일 때 true)
  // - startTransition (function): 시간이 걸리는 비동기 작업(서버 요청 등)을 백그라운드용 작업으로 등록하는 함수
  const [isPending, startTransition] = useTransition();

  // 토글(완료 여부 변경) 핸들러
  function handleToggle() {
    const next = !completed;
    
    // 1. 화면 UI를 멈춤 없이 빠르게 먼저 변경 (낙관적 업데이트)
    setCompleted(next);

    // 2. startTransition 내부에서 서버 액션 호출 (우선순위가 낮게 백그라운드에서 처리됨)
    //    작업이 진행되는 동안 isPending은 true 상태가 됩니다.
    startTransition(async () => {
      await toggleTodo(todo.id);
    });
  }

  // 삭제 핸들러
  function handleDelete() {
    // 삭제 요청 동안 브라우저 반응성을 유지하기 위해 startTransition으로 감싸서 백그라운드 처리
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  }

  return (
    <li className={styles.item}>
      {/* disabled={isPending}: 서버 처리가 진행 중일 때는 중복 클릭 방지를 위해 버튼/체크박스 비활성화 */}
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        className={styles.checkbox}
        disabled={isPending}
      />
      
      {/* 완료 상태에 따라 스타일 분기 (취소선 표시 등) */}
      <span className={completed ? styles.titleDone : styles.title}>
        {todo.title}
      </span>
      
      {/* 처리 중(isPending === true)일 때는 삭제 버튼도 클릭 불가능하게 비활성화 */}
      <button
        type="button"
        onClick={handleDelete}
        className={styles.deleteButton}
        disabled={isPending}
      >
        삭제
      </button>
    </li>
  );
}