"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 ">
      <div className="max-w-3xl text-center ">
        <h1 className="text-4xl font-bold mb-6">
          About Us
        </h1>
        <p className="text-lg mb-4">
          Welcome to <span className="font-semibold">Air Clothing Line</span>. 
          We’re a modern fashion brand passionate about creating unique, stylish, 
          and high-quality clothing for everyone.
        </p>
        <p className="text-lg mb-4">
          Our mission is to inspire confidence through fashion while 
          staying true to sustainability and innovation. 
        </p>
        <p className="text-lg">
          Thank you for being part of our journey!
        </p>
      </div>
    </main>
  );
}
