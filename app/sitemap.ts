// [10단계 메모]
// - 파일명 sitemap.ts 자체가 컨벤션입니다. "/sitemap.xml" 경로에 자동 응답합니다.
// - 정적 경로("/")뿐 아니라, todo 목록을 순회해서 동적 경로도 함께 등록합니다.

import type { MetadataRoute } from "next";
import { getTodos } from "@/lib/data";

const baseUrl = "https://example.com"; // 실제 배포 시 실제 도메인으로 교체

export default async function sitemap(): Promise<MetadataRoute.Sitemap>{
  const todos = await getTodos();
  const todoUrls: MetadataRoute.Sitemap = todos.map((todo) => ({
    url: `${baseUrl}/todos/${todo.id}`,
    lastModified: todo.createdAt,
  }));
  return [
    { url: baseUrl, lastModified: new Dat() },
    ...todoUrls
  ]
}
