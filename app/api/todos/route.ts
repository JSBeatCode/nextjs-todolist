// Next.js에서 JSON 형태의 응답을 쉽게 만들기 위한 기능
import { NextResponse } from "next/server";

// Todo 데이터를 읽고 / 저장하는 함수
import { readTodos, writeTodos } from "@/lib/db";

// "/" 페이지의 캐시를 다시 생성하도록 요청하는 함수
import { revalidatePath } from "next/cache";

// Todo 객체의 TypeScript 타입
import type { Todo } from "@/lib/types";


// ============================================================
// GET /api/todos
// ============================================================
// 브라우저나 다른 프로그램에서
// GET /api/todos 요청을 보내면 Next.js가 이 GET 함수를 자동으로 실행한다.
// 개발자가 GET()을 직접 호출하는 것이 아니다.
export async function GET() {

  // DB(이 프로젝트에서는 파일 기반 저장소)에서 Todo 전체 목록을 가져온다.
  const todos = await readTodos();

  // 가져온 Todo 목록을 JSON 응답으로 만들어 요청한 곳에 돌려준다.
  return NextResponse.json(todos);
}


// ============================================================
// POST /api/todos
// ============================================================
// 클라이언트가 POST /api/todos 요청을 보내면 Next.js가 이 POST 함수를 자동으로 실행한다.
// request에는 클라이언트가 보낸 HTTP 요청 정보가 들어 있다.
export async function POST(request: Request) {

  // request의 HTTP Body에 들어있는 JSON 데이터를 꺼낸다.
  // 예: { "title": "공부하기" }
  const body = await request.json();

  // body에서 title을 가져온다.
  // title이 문자열이면 앞뒤 공백을 제거하고, 아니면 빈 문자열로 만든다.
  const title =
    typeof body?.title === "string"
      ? body.title.trim()
      : "";

  // title이 비어 있다면 잘못된 요청이다.
  if (!title) {

    // HTTP 상태 코드 400(Bad Request)을 보내고 에러 메시지도 JSON으로 돌려준다.
    return NextResponse.json(
      { error: "title is required" },
      { status: 400 }
    );
  }

  // 현재 저장되어 있는 Todo 목록을 가져온다.
  const todos = await readTodos();

  // 새로 추가할 Todo 객체를 만든다.
  const newTodo: Todo = {

    // 새로운 Todo를 구별하기 위한 고유 ID 생성
    id: crypto.randomUUID(),

    // 사용자가 요청으로 보낸 제목
    title,

    // 새 Todo이므로 처음에는 완료되지 않은 상태
    completed: false,

    // Todo가 생성된 현재 시간을 ISO 문자열로 저장
    createdAt: new Date().toISOString(),
  };

  // 기존 Todo 목록 뒤에 새 Todo를 추가해서 저장한다.
  // [...todos, newTodo]는 기존 Todo + 새 Todo라는 새로운 배열을 만든다.
  await writeTodos([...todos, newTodo]);

  // Todo가 추가됐으므로 "/" 페이지의 캐시를 무효화한다.
  // 이후 페이지가 다시 렌더링되어 새 Todo가 화면에 나타날 수 있다.
  revalidatePath("/");

  // 새로 만들어진 Todo를 JSON으로 응답한다.
  // status: 201 = 새로운 데이터가 정상적으로 생성되었다는 HTTP 상태 코드
  return NextResponse.json(newTodo, { status: 201 });
}
