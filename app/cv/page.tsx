import { loadPublicHub, loadTagDefinitions } from "@/lib/data-loader";
import { TabbedPortfolio } from "@/components/layout/TabbedPortfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Vitae (CV) — Trần Kim Oanh",
  description:
    "Hồ sơ năng lực học thuật & CV của Trần Kim Oanh — Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo, Trường ĐHKHXH&NV Hà Nội (ĐHQGHN).",
};

export default function CVPage() {
  const hub = loadPublicHub();
  const tagDefinitions = loadTagDefinitions();

  return (
    <TabbedPortfolio
      profile={hub.profile}
      education={hub.education}
      experience={hub.experience}
      research={hub.research}
      certificates={hub.certificates}
      tagDefinitions={tagDefinitions}
      skills={hub.skills}
      initialTab="timeline"
    />
  );
}
