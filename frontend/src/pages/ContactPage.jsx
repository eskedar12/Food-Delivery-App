export function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-clay mb-6">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-2">📍 Kezira District, House #142</p>
          <p className="text-gray-600 mb-2">📍 Dire Dawa, Ethiopia</p>
          <p className="text-gray-600 mb-2">📞 +251 123 456 789</p>
          <p className="text-gray-600 mb-2">✉️ info@tafachfoods.com</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Opening Hours</h2>
          <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 10:00 PM</p>
          <p className="text-gray-600 mb-2">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
        </div>
      </div>
    </div>
  );
}