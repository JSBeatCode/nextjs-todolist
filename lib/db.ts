// [2단계 메모]
// - 이 파일이 "실제 저장소에 접근하는 유일한 창구"입니다.
// - 지금은 진짜 DB(Postgres 등) 대신 파일 시스템(fs)의 db.json 파일을 읽고 씁니다.
// - 중요: fs(Node.js 내장 모듈)는 브라우저에서 동작하지 않습니다.
//   이 파일의 함수들은 반드시 서버에서만 호출되어야 합니다.
//   (Server Component, Server Action, Route Handler 안에서만 import해서 씀 — 3~5단계에서 실제로 그렇게 씁니다)
// - 나중에 진짜 DB(Supabase 등)로 바꿀 때는 이 파일 하나만 갈아끼우면
//   lib/data.ts 이상 위쪽 레이어는 코드를 건드릴 필요가 없습니다. (관심사 분리)

import fs from "fs/promises";
import path from "path";
import type { Todo } from "./types";

const DB_PATH = path.join(process.cwd(), "lib", "db.json");

// db.json 전체를 읽어서 Todo 배열로 반환.
export async function readTodos(): Promise<Todo[]> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as Todo[];
}

// Todo 배열 전체를 db.json에 덮어씀.
// (실무 DB라면 UPDATE/INSERT 개별 쿼리를 쓰겠지만, 여기선 파일 전체를 매번 다시 씀 — mock이라 단순화)
export async function writeTodos(todos: Todo[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(todos, null, 2), "utf-8");
}