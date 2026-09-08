// [2단계 메모]
// - 이 프로젝트 전체에서 공유할 Todo 타입을 한 곳에 정의합니다.
// - lib/db.ts, lib/data.ts, components/*, app/**/*.tsx 등 여러 파일에서
//   import { Todo } from "@/lib/types" 형태로 재사용합니다.
// - Vue2 + JS 조합에서는 이런 "형태 계약"이 문서/주석으로만 존재했다면,
//   TypeScript에서는 컴파일 타임에 강제되는 게 가장 큰 차이입니다.

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 문자열로 저장 (JSON 직렬화 호환을 위해 Date 객체 대신 string 사용)
};

// 새 Todo를 만들 때 클라이언트가 넘겨줄 값의 형태.
// id, completed, createdAt은 서버(db.ts)에서 채워주므로 여기엔 없습니다.
export type CreateTodoInput = {
  title: string;
};