// [10단계 메모]
// - 파일명 sitemap.ts 자체가 컨벤션입니다. "/sitemap.xml" 경로에 자동 응답합니다.
// - 정적 경로("/")뿐 아니라, todo 목록을 순회해서 동적 경로도 함께 등록합니다.

import type { MetadataRoute } from "next";
import { getTodos } from "@/lib/data";

const baseUrl = "https://example.com"; // 실제 배포 시 실제 도메인으로 교체

// Next.js가 sitemap 데이터를 생성할 때 자동으로 호출하는 함수
// 반환값은 Next.js가 sitemap.xml로 변환함
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DB에서 Todo 목록을 가져옴
  const todos = await getTodos();

  // 각 Todo를 검색엔진에 알려줄 URL 형식으로 변환
  const todoUrls: MetadataRoute.Sitemap = todos.map((todo) => ({
    // Todo 상세 페이지의 URL
    url: `${baseUrl}/todos/${todo.id}`,

    // 해당 URL의 최종 수정일
    lastModified: todo.createdAt,
  }));

  // 사이트 메인 URL + 모든 Todo URL을 sitemap 데이터로 반환
  return [
    // 사이트 메인 페이지
    { url: baseUrl, lastModified: new Date() },

    // 위에서 만든 Todo URL들을 배열에 추가
    ...todoUrls,
  ];
}
