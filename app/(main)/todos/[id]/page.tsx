// [6단계 메모]
// - 폴더명 [id]가 동적 라우트 세그먼트입니다. /todos/1, /todos/abc 등 어떤 값이 와도
//   이 page.tsx 하나가 처리하고, 실제 값은 params로 전달받습니다.
//   (Vue Router의 { path: '/todos/:id', component: TodoDetail }과 동일한 개념)
// - Next.js 15부터 params는 Promise입니다. 그래서 이 컴포넌트도 async이고 await params로
//   풀어서 씁니다. (동기값이던 시절 코드와 헷갈리지 않도록 주의)
// - getTodoById(id)로 조회했는데 없으면 notFound()를 호출합니다.
//   notFound()는 예외를 던지는 방식으로 동작해서, 호출 즉시 이 함수의 나머지 코드는
//   실행되지 않고 Next.js가 같은 세그먼트의 not-found.tsx를 렌더링합니다.
// - <Link href="/">로 목록으로 돌아가는 링크를 둡니다. next/link는 <a>와 달리
//   전체 페이지를 새로고침하지 않고 클라이언트 사이드에서 라우팅합니다.
// [10단계 메모]
// - generateMetadata는 이 세그먼트 전용 <title>, <meta description>을 동적으로 만듭니다.
//   layout.tsx의 title.template("%s | Todo App")과 조합되어
//   최종적으로 "할 일 제목 | Todo App" 형태로 브라우저 탭에 표시됩니다.
// - getTodoById를 page와 generateMetadata 양쪽에서 각각 호출하고 있지만, Next.js가
//   같은 요청 안에서 동일한 함수 호출을 자동으로 메모이제이션(중복 제거)해줍니다.

import { getTodoById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type TodoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: TodoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const todo = await getTodoById(id);

  if (!todo) {
    return { title: '찾을 수 없음'}
  }

  return {
    title: todo.title,
    description: `"${todo.title}" 할 일의 상세 정보입니다.`,
  };
}
export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = await params;
  const todo = await getTodoById(id);
  // const test = undefined;
  // if (test.data === '1') {
  //   console.log('123')
  // }
  if (!todo) {
    notFound();
  }

  return (
    <main>
      <p>
        <Link href="/">&larr; 목록으로</Link>
      </p>
      <h1>{todo.title}</h1>
      <p>상태: {todo.completed ? "완료" : "진행중"}</p>
      <p>생성일: {new Date(todo.createdAt).toLocaleString("ko-KR")}</p>
      <p style={{ color: "#999" }}>id: {todo.id}</p>
    </main>
  );
}
