import { loadPublicHub, loadTagDefinitions } from "@/lib/data-loader";
import { TabbedPortfolio } from "@/components/layout/TabbedPortfolio";

export default function HomePage() {
  // Load public data on the server
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
    />
  );
}
