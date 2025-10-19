import Layout from "@/layout/layout";

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
    price: 95.0,
    image: "/image/perfume1.jpg",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    category: "Fresh Aquatic",
    price: 85.0,
    image: "/image/perfume2.jpg",
  },
  {
    id: 3,
    name: "Vanilla Dreams",
    category: "Oriental Vanilla",
    price: 78.0,
    image: "/image/perfume3.jpg",
  },
  {
    id: 4,
    name: "Mystic Oud",
    category: "Woody Oriental",
    price: 120.0,
    image: "/image/perfume4.jpg",
  },
];

const Shop = () => {
  return (
    <Layout>
    <div className="w-full px-4 md:px-8 lg:px-12 mt-24">
      <section className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-[#f5f0ea] p-6 rounded-sm relative"
          >
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
            <svg
              className="w-5 h-5 text-amber-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h18v4H3z"
              ></path>
            </svg>
            </div>

            <div className="mt-4 text-xs text-gray-500">
            {product.category}
            </div>
            <div className="mt-1 font-semibold text-gray-900">
            {product.name}
            </div>
            <div className="mt-2 font-medium text-gray-900">
            ${product.price.toFixed(2)}
            </div>
          </article>
        ))}
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Shop;
