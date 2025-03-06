import React from "react";
import Header from "../layout/header";
import Banner from "../layout/banner";
import Footer from "../layout/footer";
const customerReviews = [
  {
    name: "Alice Johnson",
    role: "Verified Buyer",
    rating: 5,
    text: "Excellent service and top-notch quality! Highly recommended!",
    date: "Jan 12, 2024",
    product: "Diamond Necklace",
    productImage: "https://via.placeholder.com/24",
  },
  {
    name: "Michael Smith",
    role: "Loyal Customer",
    rating: 4,
    text: "Great experience overall, but shipping was a bit slow.",
    date: "Feb 5, 2024",
    product: "Gold Bracelet",
    productImage: "https://via.placeholder.com/24",
  },
  {
    name: "Michael Smith",
    role: "Loyal Customer",
    rating: 4,
    text: "Great experience overall, but shipping was a bit slow.",
    date: "Feb 5, 2024",
    product: "Gold Bracelet",
    productImage: "https://via.placeholder.com/24",
  },
  {
    name: "Michael Smith",
    role: "Loyal Customer",
    rating: 4,
    text: "Great experience overall, but shipping was a bit slow.",
    date: "Feb 5, 2024",
    product: "Gold Bracelet",
    productImage: "https://via.placeholder.com/24",
  },
];
const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Banner
                title="Services & Industries"
                description="We empower enterprises to achieve highest potential with extensive capabilities,
domain expertise and cutting-edge AI solutions."
            />
      <div className="text-center mb-10">
        <div className="mt-10">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
            About Us
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          In all of FPT Software's comprehensive service and solutions, AI is
          embedded as an accelerator to enable new levels of performance for
          clients and enhance efficiency in our own operations.
        </p>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-[75%] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transition-transform duration-300 hover:-translate-y-5">
              <img
                className="w-full h-auto rounded-lg"
                alt="Modern AI"
                src="https://itchronicles.com/wp-content/uploads/2020/11/where-is-ai-used.jpg"
              />
            </div>
            <div>
              <h2 className="text-yellow-400 text-xl font-semibold mb-2">
                Morden AI
              </h2>
              <h3 className="text-2xl font-bold mb-4">
                Modern AI with higher performance
              </h3>
              <p className="text-gray-600">
                In all of FPT Software's comprehensive service and solutions, AI
                is embedded as an accelerator to enable new levels of
                performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[75%] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div>
              <h2 className="text-yellow-400 text-xl font-semibold mb-2">
                Flexible Solutions
              </h2>
              <h3 className="text-2xl font-bold mb-4">
                Exciting and innovative
              </h3>
              <p className="text-gray-600">
                In all of FPT Software's comprehensive service and solutions, AI
                is embedded as an accelerator to enable new levels of
                performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.In all of FPT Software's comprehensive service and
                solutions, AI is embedded as an accelerator to enable new levels
                of performance for clients and enhance efficiency in our own
                operations.
              </p>
              <p className="text-gray-600">
                Building an inclusive, future-ready and happy workforce, while
                allowing our team to thrive on challenging missions and benefit
                from the latest in technologies.In all of FPT Software's
                comprehensive service and solutions, AI is embedded as an
                accelerator to enable new levels of performance for clients and
                enhance efficiency in our own operations.
              </p>
            </div>
            <div className="transition-transform duration-300 hover:-translate-y-5 ">
              <img
                className="w-full h-auto rounded-lg"
                alt="Necklace"
                src="https://itchronicles.com/wp-content/uploads/2020/11/where-is-ai-used.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-screen h-[700px] bg-black flex items-center justify-center relative overflow-hidden mt-8">
        <div className="absolute top-0 left-0 right-0 bottom-1/2 bg-black text-white flex flex-col items-center justify-center text-center z-20 p-6">
          <h2 className="text-yellow-400 text-sm font-semibold mb-2">
            OUR POLICY
          </h2>
          <h3 className="text-3xl font-bold mb-4">
            Popular understanding, <br />
            <u>coding</u> for everyone!
          </h3>
          <p className="text-gray-300">
            Cardigan helvetica sriracha, portland celiac truffaut woke <br />
            artisan succulents cred art party slow-carb pinterest. Migas <br />
            humblebrag chicharrones everyday carry four loko.
          </p>
        </div>
        <iframe
          className="absolute w-[2000px] h-[1000px] top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          src="https://www.youtube.com/embed/kPa7bsKwL-c?autoplay=1&mute=1&loop=1&start=11&end=19&playlist=kPa7bsKwL-c&controls=0&modestbranding=1&rel=0&disablekb=1"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="py-12 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center pb-4">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {customerReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-lg p-6 flex flex-col justify-between h-full"
            >
              {/* Header - Avatar + Name + Verified Badge */}
              <div className="flex items-center mb-4 relative">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white text-lg font-bold rounded-full">
                  {review.name[0]}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
                {/* Verified Badge */}
                <span className="absolute top-0 right-0 text-blue-500 text-xl">
                  ✔️
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-3">{review.text}</p>

              {/* Date */}
              <p className="text-xs text-gray-500">{review.date}</p>

              {/* Product Image & Name */}
              <div className="flex items-center mt-3">
                <img
                  src={review.productImage}
                  alt={review.product}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <p className="text-sm text-gray-700 font-medium">
                  {review.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
