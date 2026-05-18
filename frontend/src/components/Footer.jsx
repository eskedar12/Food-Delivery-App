export function Footer() {
  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              <span className="text-clay">TAFACH</span>
              <span className="text-forest"> FOODS</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Bringing the authentic flavors of Dire Dawa to your home. Traditional heart, modern speed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Browse Menu</li>
              <li>Delivery Areas</li>
              <li>Mobile App</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Location</h4>
            <p className="text-sm text-gray-400">Kezira District, House #142</p>
            <p className="text-sm text-gray-400">Dire Dawa, Ethiopia</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Tafach Foods. Built for the pride of Dire Dawa.
        </div>
      </div>
    </footer>
  );
}