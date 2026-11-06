import { loadPublicHub, loadTagDefinitions } from "@/lib/data-loader";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Research } from "@/components/sections/Research";
import { Timeline } from "@/components/sections/Timeline";
import { Certificates } from "@/components/sections/Certificates";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  // Load public data on the server
  const hub = loadPublicHub();
  const tagDefinitions = loadTagDefinitions();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar name={hub.profile.name} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero profile={hub.profile} />
        <About profile={hub.profile} />
        <Research items={hub.research} />
        <Timeline education={hub.education} experience={hub.experience} />
        <Certificates
          certificates={hub.certificates}
          tagDefinitions={tagDefinitions}
        />
        <Skills skills={hub.skills} />
        <Contact profile={hub.profile} />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/60 py-10 px-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {hub.profile.name.vi} ({hub.profile.name.en}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:underline">
              ↑ Lên đầu trang / Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
