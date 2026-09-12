"use client";
// [5단계 메모]
// - useActionState는 React 19의 훅으로, "서버 액션 호출 + 그 결과 상태 + 진행 중 여부"를
//   한 번에 관리해줍니다. Vue2였다면 loading ref를 직접 만들고 axios 호출 전후로
//   loading.value = true/false를 수동으로 토글하던 걸, 여기선 훅이 대신 해줍니다.
// - <form action={formAction}>은 HTML 기본 <form action="/url">과 문법은 비슷하지만
//   실제로는 URL이 아니라 서버 액션 함수를 가리킵니다. JS가 아직 로드되기 전이라도
//   서버로 폼이 정상 제출되는 점진적 향상(progressive enhancement)이 특징입니다.
// - addTodo 자체는 결과값을 안 돌려주므로, 여기서는 "제출이 끝났다"는 신호만 받아서
//   입력창을 비우는 데 씁니다.


// 이 컴포넌트는 브라우저에서 실행되는 Client Component라는 뜻
// useActionState, useEffect, useRef 같은 React Hook을 사용하기 위해 필요


import { useActionState, useEffect, useRef } from "react";
// useActionState : 액션 실행 + 결과 state + 실행 중 여부(isPending) 관리
// useEffect       : 특정 값이 변경됐을 때 코드 실행
// useRef          : DOM 요소를 직접 가리킬 때 사용

import { addTodo } from "@/app/(main)/todos/actions";
// 실제 Todo 추가를 처리하는 함수(Server Action)

import styles from "./AddTodoForm.module.css";
// 이 컴포넌트에서 사용할 CSS Module


// submitAddTodo 함수가 사용하는 state의 타입
// submittedAt : Todo 추가가 완료된 시간을 저장
// 아직 아무것도 실행하지 않았다면 null
type SubmitState = { submittedAt: number } | null;


// form이 제출되었을 때 실행될 함수
async function submitAddTodo(
  _prevState: SubmitState,
  // useActionState가 자동으로 전달해주는 "이전 state"
  // 현재 코드에서는 사용하지 않기 때문에 앞에 _를 붙임

  formData: FormData
  // <form>에서 제출된 데이터를 React가 자동으로 전달해 줌
): Promise<SubmitState> {

  // 실제 Todo 추가 작업 실행
  await addTodo(formData);

  // 이 return 값이 useActionState의 state가 됨
  // 즉 state = { submittedAt: 현재시간 }
  return { submittedAt: Date.now() };
}


export default function AddTodoForm() {

  // useActionState가 3개의 값을 반환
  const [state, formAction, isPending] =
    useActionState(submitAddTodo, null);

  // state
  // → submitAddTodo의 return 값
  // → 처음에는 null
  // → submitAddTodo가 끝나면 { submittedAt: ... }이 됨

  // formAction
  // → 폼이 제출됐을 때 실행할 함수
  // → 아래 <form action={formAction}>에 연결함

  // isPending
  // → submitAddTodo가 실행 중이면 true
  // → 끝나면 false
  // → React가 자동으로 관리해 줌


  // form DOM을 가리키기 위한 ref 생성
  const formRef = useRef<HTMLFormElement>(null);

  // 처음에는 아직 연결된 form이 없으므로 current는 null
  // 아래 <form ref={formRef}>에서 실제 form DOM과 연결됨


  // state가 변경될 때마다 실행되는 코드
  useEffect(() => {

    // state가 null이 아니라면
    // 즉 Todo 추가 작업이 완료됐다면
    if (state) {

      // formRef.current = 실제 <form> DOM
      // reset() = form 안의 입력값을 초기화
      formRef.current?.reset();
    }

  }, [state]);
  // [state] → state가 변경될 때마다 이 useEffect 실행


  return (
    <form
      ref={formRef}
      // 실제 <form> DOM을 formRef에 연결
      // 따라서 formRef.current로 이 form에 접근할 수 있음

      action={formAction}
      // form을 제출하면 formAction 실행
      // 결국 다음 흐름이 됨:
      //
      // form 제출
      //   ↓
      // formAction
      //   ↓
      // submitAddTodo(prevState, formData)
      //   ↓
      // addTodo(formData)
      //   ↓
      // return 값이 state가 됨

      className={styles.form}
      // CSS Module의 form 스타일 적용
    >

      <input
        type="text"
        name="title"
        // 이 이름 때문에 제출된 FormData에서
        // formData.get("title") 형태로 값을 가져올 수 있음

        placeholder="할 일을 입력하세요"
        required
        // 입력값이 없으면 제출하지 못하게 함

        className={styles.input}

        disabled={isPending}
        // Todo 추가 중이면 입력창 비활성화
      />

      <button
        type="submit"
        className={styles.button}

        disabled={isPending}
        Todo 추가 중이면 버튼도 비활성화
      >
        {
          isPending
            ? "추가 중..."
            : "추가"
        }
        {/* // 실행 중 → "추가 중..." */}
        {/* // 실행이 끝남 → "추가" */}
      </button>

    </form>
  );
}