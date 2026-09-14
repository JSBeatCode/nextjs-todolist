"use client";
// [5단계 메모]
// - 4단계에서는 체크박스가 로컬 state만 바꾸고 새로고침하면 원상복구됐습니다.
//   이제 toggleTodo(Server Action)를 실제로 호출해서 db.json에도 반영합니다.
// - Server Action(toggleTodo, deleteTodo)을 Client Component 안에서 그냥 일반 함수처럼
//   import해서 호출할 수 있다는 게 포인트입니다.
// - useTransition으로 감싼 이유: 서버 응답을 기다리는 동안 UI가 멈추지 않게 하고,
//   isPending으로 "처리 중" 상태를 표시하기 위함입니다.
// - 먼저 setCompleted로 화면을 낙관적으로(optimistic) 바꾸고, 그 다음 서버에 반영합니다.
// - toggleTodo/deleteTodo(Server Action)를 호출해서 db.json에 실제로 반영합니다.
// - useTransition으로 감싸 서버 응답을 기다리는 동안 UI가 멈추지 않게 하고,
// [6단계 메모]
// - 제목을 <Link href={`/todos/${todo.id}`}>로 감싸서 상세 페이지로 이동 가능하게 했습니다.
// - 주의: <Link>를 <span onClick={...}> 체크박스와 같은 <li> 안에 두되, 체크박스 자체의
//   onChange는 별도 이벤트라 Link 클릭과 충돌하지 않습니다.

import { useState, useTransition } from "react";

// Next.js의 내장 클라이언트 사이드 라우팅 컴포넌트를 불러옵니다.
// HTML의 <a> 태그와 달리 페이지 전체를 새로고침(Full Reload)하지 않고, SPA처럼 필요한 부분만 빠르게 이동시킵니다.
import Link from "next/link";
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
      
      {/* 
        [Next.js <Link> 컴포넌트 핵심 포인트]
        1. href={`/todos/${todo.id}`}: 템플릿 리터럴을 통해 클릭 시 해당 Todo의 상세 페이지 URL 경로로 이동합니다.
        2. 클라이언트 사이드 프리패칭(Prefetching): 
           화면에 <Link> 태그가 보이면 Next.js가 자동으로 백그라운드에서 이동할 경로의 코드를 미리 불러와 
           클릭 시 즉시 빠르게 페이지가 전환됩니다.
        3. className 조건부 스타일링: 
           completed(완료 여부) 상태에 따라 취소선 스타일(titleDone) 또는 기본 스타일(title)을 동적으로 적용합니다.
      */}
      <Link
        href={`/todos/${todo.id}`}
        className={completed ? styles.titleDone : styles.title}
      >
        {todo.title}
      </Link>
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