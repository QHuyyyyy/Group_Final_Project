import React from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";

const Contactus: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div>
      <div className="relative h-[400px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(45deg, #000428, #004e92)',
            opacity: 0.9
          }}
        />
        
        {/* Add a subtle pattern overlay */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("https://fptsoftware.com/-/media/project/fpt-software/fso/uplift/contact-us/banner/contact-us-banner-bg-mobile.webp?extension=webp&modified=20241120073702&hash=F04DF1D04BA211E0F0F30BB27A202038")',
            mixBlendMode: 'overlay'
          }}
        />
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white tracking-wide">
            Contact Us
          </h1>
        </div>
      </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Get in
              <span className="text-green-500"> Touch </span>
              with
              <span className="text-orange-500"> Us</span>
            </h1>
            <p className="mt-2 text-lg">
              Please fill in the form below and let us know your thoughts!
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <nav className="flex space-x-6 text-orange-500">
              <a className="border-b-2 border-orange-500 pb-1" href="#">
                Our product support/service
              </a>
              <a className="hover:text-orange-500" href="#">
                Partner with us
              </a>
              <a className="hover:text-orange-500" href="#">
                Career opportunities
              </a>
              <a className="hover:text-orange-500" href="#">
                Website feedback
              </a>
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row mt-10">
            <div className="lg:w-1/2 flex justify-center">
              <img
                src="https://storage.googleapis.com/a1aa/image/TYuVYU-_BoG8-cCE1zx-GIAZj0jeqH4esFVzLCZejEU.jpg"
                alt="A person holding a smartphone with an email icon floating above the screen"
                className="rounded-lg shadow-lg"
                width="400"
                height="400"
              />
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0 lg:pl-10">
              <form className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Your First name"
                    className="w-1/2 p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Your Last name"
                    className="w-1/2 p-3 border rounded-lg"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Business Email Address"
                  className="w-full p-3 border rounded-lg"
                />
                <select className="w-full p-3 border rounded-lg">
                  <option>Select country</option>
                </select>
                <input
                  type="text"
                  placeholder="Your Company Name"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Your message"
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                ></textarea>
                <button type="submit" className="w-full p-3 bg-orange-500 text-white rounded-lg">
                  Submit
                </button>
              </form>
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
      <div className="w-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Headquarter</h2>
          
          <div className="space-y-8">
            {/* Head Office */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Head Office</h3>
                <p className="text-gray-400">FPT Tower, No.10 Pham Van Bach Street, Dich Vong Ward, Cau Giay District, Hanoi City, Vietnam.</p>
              </div>
            </div>

            {/* Registered Office */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Registered Office</h3>
                <p className="text-gray-400">FPT Cau Giay Building, Duy Tan Street, Dich Vong Hau Ward, Cau Giay District, Hanoi City, Vietnam.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-gray-400">(+84) 243 768 9048</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black">
                Contact Us
              </button>
              <button className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contactus;
