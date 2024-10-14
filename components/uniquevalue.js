import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function UniqueValue() {
  const router = useRouter(); // Initialize the router

  return (
    <section className="py-20 bg-gray-200">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-gray-800">What makes OraVew different?</h2>
          <p className="mt-4 text-lg text-gray-600">
            We welcome outside catering and BYOB. No vendor restrictions, no service or gratuity fees, and no food and beverage minimums.
            Our mid-sized event space can accommodate up to 60 people for seated service or cocktail event.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]"
            onClick={() => router.push('/contact')} // Route to contact page
          >
            Book Now
          </button>
        </div>
        <div className="lg:w-1/2 p-8">
          <Image
            src="/chivari.png"
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
