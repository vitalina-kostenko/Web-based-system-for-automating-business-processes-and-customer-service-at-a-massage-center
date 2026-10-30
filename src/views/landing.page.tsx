import { ServiceCard, listServices } from "@/entities/service";
import { LandingFeatures, LandingFooter, LandingHeader, LandingHero } from "@/widgets/landing";

// page
export async function LandingPage() {
  const services = await listServices();
  // return
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <section id="services" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="page-title mb-6">Наші послуги</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
