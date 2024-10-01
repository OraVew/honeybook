import Image from 'next/image';

export default function CTA() {
  return (
    <section className="py-20 bg-gray-200">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-gray-800">Start Planning Your Custom Event</h2>
          <p className="mt-4 text-lg text-gray-600">
            Ready to get started? Get in touch to start the planning process for your birthday, baby shower, engagement dinner, and more.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]"
            onClick={() => document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </button>
        </div>
        <div className="lg:w-1/2 p-8">
          <Image
            src="/standard1.jpg"
            alt="Placeholder Image"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
            style={{ height: 'auto', width: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}
