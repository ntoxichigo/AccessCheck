export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-gray-600">Have questions? We’d love to hear from you.</p>
          <form className="mt-10 grid gap-4 max-w-xl">
            <input className="border rounded p-3" placeholder="Name" />
            <input className="border rounded p-3" placeholder="Email" type="email" />
            <textarea className="border rounded p-3" placeholder="How can we help?" rows={6} />
            <button className="px-5 py-3 rounded bg-blue-600 text-white font-medium">Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}

