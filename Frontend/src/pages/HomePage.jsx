import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto text-center mt-10">
        <h1 className="text-4xl font-bold">Welcome to QuickCourt</h1>
        <p className="mt-4 text-lg text-gray-600">
          Book sports facilities and join matches in your area.
        </p>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Explore Venues
        </button>
      </div>
    </>
  );
}
