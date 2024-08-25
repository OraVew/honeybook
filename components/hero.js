export default function Hero() {
    return (
      <section className="relative h-screen bg-gray-200">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full bg-opacity-50 bg-gray-800">
          <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: "#D69600" }}>
              A boutique event and venue space in Goose Island Chicago
            </p>
            <h1 className="mt-4 text-6xl font-bold text-white">Design your custom event without the stress.</h1>
            <button
              className="mt-8 px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]"
              onClick={() => document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Event
            </button>
          </div>
        </div>
      </section>
    );
  }
  