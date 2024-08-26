import Image from 'next/image';

export default function Features() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto h-full">
        <div className="flex flex-col lg:flex-row items-center h-full">
          <div className="lg:w-1/2 p-8 h-full flex justify-center">
            <Image
              src="/bday4.jpg"
              alt="Placeholder Image"
              width={500}
              height={500}
              className="rounded-lg shadow-lg max-h-[70%] w-auto"
              style={{ height: 'auto', width: 'auto', maxHeight: '70%' }}
            />
          </div>
          <div className="lg:w-1/2 p-8">
            <h2 className="text-4xl font-bold text-gray-800">Welcome to The Celebration Loft</h2>
            <p className="mt-4 text-lg text-gray-600">
              Located in Chicago, IL, our boutique event venue is a modern space that can be completely customized for your next private gathering.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]"
              onClick={() => document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
