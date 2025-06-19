"use client";
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white mt-auto">
      {/* Info Section */}
      <section className="bg-[#000] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/place/Kr+13+%23+65-10,+Chapinero,+Bogotá,+D.C.,+Bogotá,+Bogotá,+D.C./@4.651911,-74.0630135,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a45d07b6607:0x7afea3e6e701227b!8m2!3d4.651911!4d-74.0630135!16s%2Fg%2F11x11gz5tf?entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D"
              className="flex items-center gap-3 hover:text transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#fff]">SENA CALLE 13 # 65-10</p>
              </div>
            </a>
            <a
              href="tel:+573143575304"
              className="flex items-center gap-3 hover:text transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#fff]">+57 314 357 5304</p>
              </div>
            </a>
            <a
              href="mailto:arcade.store03@gmail.com"
              className="flex items-center gap-3 hover:text transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#fff]">arcade.store03@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-[#fff] text-gray-300 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className=' text-[#000]'>
            &copy; <span>{currentYear}</span> Todos los derechos reservados por{' '}
            <a
              href="https://html.design/"
              target="_blank"
              rel="noopener noreferrer"
              className=" text-[#000] hover:underline"
            >
              ArcadeStore
            </a>
          </p>
        </div>
      </section>
    </footer>
  );
}