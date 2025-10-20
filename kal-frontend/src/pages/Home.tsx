import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const bananaImage =
  "https://fashinza.com/textile/wp-content/uploads/2022/02/0452123d13350d15b49f2d1a67f2d485-545x600-1.jpg";

const Home: React.FC = () => {
  return (
    <div>
      {/* == Welcome (background image) == */}
      <section
        className="bg-cover bg-center min-h-[520px] flex items-center"
        style={{ backgroundImage: `url(${bananaImage})` }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:pr-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-cream drop-shadow-lg">
              Welcome to Kalungu
            </h1>
            <p className="text-lg text-brand-cream mb-6 leading-relaxed drop-shadow-md">
              We craft sustainable, stylish garments inspired by nature — using
              eco-friendly fibres like banana fibre. Style with conscience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link to="/about">
                <Button variant="primary" size="md" className="bg-brand-terracotta text-brand-cream hover:bg-brand-brown">
                  Learn More
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="md" className="border-brand-green text-brand-green hover:bg-brand-olive hover:text-brand-cream">
                  Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* == About highlights == */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-brand-brown mb-10 text-center">
            Our Story — Highlights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainable Materials",
                text: "We prioritize banana fibre and other renewable materials for low environmental impact.",
              },
              {
                title: "Community First",
                text: "We train and pay artisans fairly, building local capacity and preserving craft.",
              },
              {
                title: "Quality Craftsmanship",
                text: "Every piece is inspected and finished by hand for durability and comfort.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <h4 className="font-semibold text-brand-green mb-3 text-lg">
                  {card.title}
                </h4>
                <p className="text-brand-charcoal mb-6 leading-relaxed">{card.text}</p>
                <Link to="/about">
                  <Button variant="ghost" size="sm" className="text-brand-terracotta hover:text-brand-brown">
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* == Products == */}
      <section className="py-16 bg-brand-beige">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-brand-brown">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col"
              >
                <div className="h-40 bg-brand-sage rounded mb-4 flex items-center justify-center">
                  <span className="text-brand-slate">Product image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-brand-green">
                  Product {n}
                </h3>
                <p className="text-brand-charcoal text-sm mb-4">
                  Short description that highlights sustainability & style.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <Link to="/products">
                    <Button variant="ghost" size="sm" className="text-brand-terracotta hover:text-brand-brown">
                      View
                    </Button>
                  </Link>
                  <span className="font-semibold text-brand-brown">
                    UGX 120,000
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* == Testimonials == */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-brand-green">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah L.",
                review: "Absolutely love Kalungu! The fabric is soft and eco-friendly.",
              },
              {
                name: "James K.",
                review: "Great fit and fast delivery. Fantastic value for quality.",
              },
              {
                name: "Maria N.",
                review: "Stylish pieces that get compliments every time I wear them.",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-lg shadow hover:shadow-md transition flex flex-col ${
                  idx % 2 === 0 ? "bg-brand-blush" : "bg-brand-sage"
                }`}
              >
                <p className="text-brand-charcoal italic mb-4">“{t.review}”</p>
                <h4 className="font-semibold text-brand-green">— {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
