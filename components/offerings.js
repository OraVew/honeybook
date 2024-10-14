import Image from 'next/image';
import Link from 'next/link'; // Import Link for routing

export default function Offerings() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800">Offerings</h2>
        <div className="flex flex-wrap justify-around mt-10">
          <div className="max-w-xs bg-white p-6 rounded-lg shadow-lg">
            <Image
              src="/standard2.png"
              alt="Expert Team"
              width={300}
              height={300}
              className="rounded-lg"
            />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Expert Team</h3>
            <p className="mt-2 text-gray-600">
              With your input and our personalized service, we&apos;ll create an event that is exactly what you envision.
            </p>
          </div>
          <div className="max-w-xs bg-white p-6 rounded-lg shadow-lg">
            <Image
              src="/gameroom5.JPG"
              alt="Amenities"
              width={300}
              height={300}
              className="rounded-lg"
            />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Amazing Amenities</h3>
            <p className="mt-2 text-gray-600">
              With a free parking lot for all your guests and a long list of amazing amenities, bringing your dream event to life is simple and easy.
            </p>
          </div>
          <div className="max-w-xs bg-white p-6 rounded-lg shadow-lg">
            <Image
              src="/bday5.JPG"
              alt="Hourly Pricing"
              width={300}
              height={300}
              className="rounded-lg"
            />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Flexible Pricing</h3>
            <p className="mt-2 text-gray-600">
              We offer flexible pricing for weekdays and weekends to fit the exact needs of your custom event.
            </p>
          </div>
        </div>
        
        {/* Add Learn More button below the offerings */}
        <div className="text-center mt-10">
          <Link href="/event-offerings">
            <a className="inline-block px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]">
              Learn More
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
