"use client";
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white">
      {/* Info Section */}
      <section className="bg-[#000] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/place/Kr+13+%23+65-10,+Chapinero,+Bogotá,+D.C.,+Bogotá,+Bogotá,+D.C./@4.651911,-74.0630135,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a45d07b6607:0x7afea3e6e701227b!8m2!3d4.651911!4d-74.0630135!16s%2Fg%2F11x11gz5tf?entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D"
              className="flex items-center gap-3 hover:text-yellow-500 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-900 font-bold">
                {/* <img src="/images/location.png" alt="Ubicación" /> */}
              </div>
              <div>
                <p className="font-semibold text-[#fff]">ubicacion</p>
                <p className="text-sm text-[#fff]">SENA CALLE 13 # 65-10</p>
              </div>
            </a>
            <a
              href="tel:+573143575304"
              className="flex items-center gap-3 hover:text-yellow-500 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-900 font-bold">
                {/* <img src="/images/phone.png" alt="Teléfono" /> */}
                <span className="material-icons text-[#fff]">phone</span>
              </div>
              <div>
                <p className="font-semibold text-[#fff]">+57 314 357 5304</p>
              </div>
            </a>
            <a
              href="mailto:arcade.store03@gmail.com"
              className="flex items-center gap-3 hover:text-yellow-500 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-900 font-bold">
                {/* <img src="/images/email.png" alt="Correo" /> */}
                <span className="material-icons text-[#fff]">email</span>
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