import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/pets-hero.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold">Find Your Furry Friend</h1>
          <p className="text-lg md:text-xl mt-4">Adopt a pet & give them a forever home.</p>
          <Link href="/home">
            <button className="mt-6 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition">
              Adopt Now
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Why Adopt From Us?</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Healthy & Vaccinated</h3>
            <p className="mt-2 text-gray-600">All pets are health-checked and vaccinated.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Rescue & Shelter Support</h3>
            <p className="mt-2 text-gray-600">We support shelters by finding loving homes.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Easy Adoption Process</h3>
            <p className="mt-2 text-gray-600">Our adoption process is quick and smooth.</p>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="bg-gray-200 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Meet Our Lovely Pets</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <Image src="/dog1.jpg" width={300} height={200} alt="Dog" className="rounded-lg" />
            <h3 className="mt-4 text-xl font-semibold">Buddy</h3>
            <p className="text-gray-600">Golden Retriever • 2 Years Old</p>
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <Image src="/cat1.jpg" width={300} height={200} alt="Cat" className="rounded-lg" />
            <h3 className="mt-4 text-xl font-semibold">Whiskers</h3>
            <p className="text-gray-600">Persian Cat • 1 Year Old</p>
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <Image src="/dog2.jpg" width={300} height={200} alt="Dog" className="rounded-lg" />
            <h3 className="mt-4 text-xl font-semibold">Charlie</h3>
            <p className="text-gray-600">Labrador • 3 Years Old</p>
          </div>
        </div>
        <Link href="/home">
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
            View More Pets
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>© 2025 adopt&care All rights reserved.</p>
      </footer>
    </main>
  );
}
