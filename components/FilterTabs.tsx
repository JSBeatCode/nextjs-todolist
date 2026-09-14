"use client";
// [7단계 메모]
// - 이 컴포넌트는 "use client"입니다. usePathname/useSearchParams 같은 훅은
//   현재 URL 상태를 브라우저에서 읽는 훅이라 Client Component에서만 쓸 수 있습니다.
// - 탭을 클릭하면 실제로는 <Link href="/?filter=active"> 로 URL만 바꿉니다.
//   상태(state)를 따로 관리하지 않고 "URL 자체가 상태"라는 게 이 패턴의 핵심입니다.
//   (Vuex에 filter 값을 저장하던 방식과 달리, 새로고침해도 필터가 유지되고
//    URL을 공유하면 같은 필터가 걸린 화면을 그대로 전달할 수 있습니다.)
// - URL이 바뀌면 Next.js가 app/page.tsx(Server Component)를 다시 실행해서
//   서버에서 새 필터로 다시 데이터를 가져옵니다. 클라이언트에서 배열을 직접
//   filter()하는 게 아니라는 점이 중요합니다.
// - useSearchParams()로 현재 필터 값을 읽어와 활성 탭에 다른 스타일을 줍니다.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { TodoFilter } from "@/lib/data";
import styles from "./FilterTabs.module.css";

const TABS: { label: string; value: TodoFilter }[] = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function FilterTabs() {
  const searchParams = useSearchParams();
  const currentFilter = (searchParams.get("filter") as TodoFilter) || "all";

  return (
    <nav className={styles.tabs}>
      {TABS.map((tab) => {
        const isActive = currentFilter === tab.value;
        const href = tab.value === "all" ? "/" : `/?filter=${tab.value}`;

        return (
          <Link
            key={tab.value}
            href={href}
            className={isActive ? styles.tabActive : styles.tab}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}