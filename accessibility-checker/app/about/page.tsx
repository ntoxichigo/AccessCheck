export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold mb-4">About AccessCheck</h1>
          <p className="text-lg text-gray-600">
            We build fast, developer-friendly accessibility tooling so teams can meet WCAG standards without slowing down.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {['Speed','Accuracy','Clarity'].map((t) => (
              <div key={t} className="rounded-2xl border p-6">
                <div className="text-sm text-gray-500">Our focus</div>
                <div className="text-2xl font-semibold">{t}</div>
                <p className="text-gray-600 mt-2">We obsess over {t.toLowerCase()} so you can ship accessible UI.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

