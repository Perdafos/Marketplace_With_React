import Layout from "../layout/layout";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Midnight Rose",
    category: "Sweet Floral",
    price: 95.00,
    image: "/image/perfume1.jpg"
  },
  {
    id: 2,
    name: "Ocean Breeze",
    category: "Fresh Aquatic",
    price: 85.00,
    image: "/image/perfume2.jpg"
  },
  {
    id: 3,
    name: "Vanilla Dreams",
    category: "Oriental Vanilla",
    price: 78.00,
    image: "/image/perfume3.jpg"
  },
  {
    id: 4,
    name: "Mystic Oud",
    category: "Woody Oriental",
    price: 120.00,
    image: "/image/perfume4.jpg"
  }
];

export default function Index() {
  return (
    <Layout>
      <div className="w-full">
        <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
          <img
            src="image/vogue.png"
            alt="vogue"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1
              className="text-[8rem] md:text-[12rem] leading-none text-white italianno font-normal max-w-[1400px] w-full select-none tracking-widest"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.6)', transform: 'translateY(-2rem)' }}
            >
              t d`Or — Eclat
            </h1>

            <p className="mt-6 text-sm md:text-base text-white/90 max-w-xl">
              Discover the essence of elegance in every precious drop
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-white text-black py-2 px-4 rounded-md shadow-sm hover:opacity-90">
                Shop fragrances
              </button>
              <button className="border border-white text-white py-2 px-4 rounded-md hover:bg-white/10">
                Discover your scent
              </button>
            </div>
          </div>
        </section>
        {/* product showcase section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <p className="text-xs text-gray-400">Top selling perfume world wide</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif text-gray-800">
              Experience <span className="italic text-amber-600">irresistible fragrances</span> that are
              guaranteed to <span className="italic text-amber-600">keep you coming back</span> for more.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <article key={product.id} className="bg-[#f5f0ea] p-6 rounded-sm relative">
                {/* product image */}
                <div className="w-full h-56 bg-white/60 rounded-md flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-28 h-44 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-28 h-44 bg-white shadow-inner rounded-md" />
                  )}
                </div>

                {/* badge icon top-right */}
                <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-sm">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v4H3z"></path></svg>
                </div>

                <div className="mt-4 text-xs text-gray-500">{product.category}</div>
                <div className="mt-1 font-semibold text-gray-900">{product.name}</div>
                <div className="mt-2 font-medium text-gray-900">${product.price.toFixed(2)}</div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="bg-amber-700 text-white py-2 px-6 rounded-md">View all</button>
          </div>
        </section>
        {/* art of scent two-column section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* left: large background with framed square placeholder */}
            <div className="w-full h-[520px] bg-[url('/image/placeholder-bg.png')] bg-center bg-cover relative overflow-hidden" aria-hidden>
              {/* dark textured background substitute - using neutral bg if image not present */}
              <div className="absolute inset-0 bg-gray-800/60"></div>

              <div className="absolute left-12 top-12 w-48 h-48 border-8 border-white shadow-lg bg-white flex items-center justify-center">
                {/* inner square placeholder for product photo */}
                <div className="w-40 h-40 bg-gray-200" />
              </div>
            </div>

            {/* right: content */}
            <div className="w-full bg-[#f2ebe4] p-12 flex flex-col items-start justify-center">
              <p className="text-sm text-gray-500">The art of scent</p>

              <h3 className="mt-4 text-3xl md:text-4xl font-serif text-gray-800 leading-snug">
                Savor the <span className="italic text-amber-600">ethereal bouquet</span> of
                fragrances, crafted
                <br />with <span className="italic text-amber-600">exquisite botanicals</span> for
                <br />your enlightenment.
              </h3>

              <button className="mt-8 bg-amber-700 text-white py-2 px-6 rounded-md">Discover our ingredients</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
