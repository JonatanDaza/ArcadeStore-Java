'use client';


import { useState } from "react";
import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";

function limitText(text, max) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

const HomePage = ({ juegosDestacados = [], juegosRecientes = [] }) => {
  const [isAuthenticated] = useState(true);
  const [userRole] = useState("admin");
  const [userName] = useState("Jonatan");
  const [userNick] = useState("JDaza");
  const userId = 123;

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={userName}
        userNick={userNick}
        userId={userId}
      />
      <main className="min-h-screen">
        {/* Slider Section */}
        <section className="relative from-gray-900 to-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Carousel indicators */}
              <div className="flex justify-center mb-4 space-x-2">
                {(juegosDestacados || []).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === 0 ? "bg-yellow-400" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              {/* Carousel items (solo muestra el primero como ejemplo) */}
              {(juegosDestacados || []).slice(0, 1).map((juego, index) => (
                <div
                  key={juego.id}
                  className="flex flex-col md:flex-row items-center justify-between"
                >
                  <div className="md:w-1/2 p-8 bg-black bg-opacity-60 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-2 drop-shadow">
                      {juego.titulo}
                      <br />
                      <span className="text-yellow-400 text-xl">
                        {juego.categoria?.nombre_categoria || "Sin Categoría"}
                      </span>
                    </h1>
                    <p className="mb-4">{limitText(juego.descripcion, 200)}</p>
                    <a
                      href={`/tienda/${juego.id}`}
                      className="inline-block text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition"
                    >
                      Compra ahora
                    </a>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <img
                      src={`/images/${juego.imagen}`}
                      alt={juego.titulo}
                      className="rounded-lg shadow-lg max-h-[400px] object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Juegos Recientes */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#3a6aff] fw-blod mb-10">
              Juegos Recientes
            </h2>
            {(juegosRecientes || []).map((juego, index) => (
              <section
                className="flex flex-col md:flex-row items-center mb-12 bg-white rounded-lg shadow-md overflow-hidden"
                key={juego.id}
              >
                <div className={`md:w-1/2 ${index % 2 !== 0 ? "md:order-2" : ""}`}>
                  <img
                    src={`/images/${juego.imagen}`}
                    alt={juego.titulo}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {juego.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {limitText(juego.descripcion, 150)}
                  </p>
                  <a
                    href={`/tienda/${juego.id}`}
                    className="text-yellow-500 font-semibold hover:underline"
                  >
                    Más información
                  </a>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Service Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold fw-blod text-[#000] mb-10">
              NUEVOS{" "}
              <span className="text-[#3a6aff] fw-blod">JUEGOS</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  COMPRA HOY
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¡No te pierdas nuestras ofertas de hoy! Aprovecha increíbles
                  descuentos en una selección de los mejores videojuegos de PC. Es
                  el momento perfecto para ampliar tu colección y disfrutar de
                  títulos únicos a precios irresistibles. La promoción es por
                  tiempo limitado.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  INTERCAMBIA VIDEOJUEGO
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¿Te gustaría probar algo nuevo? Aprovecha nuestra opción de
                  intercambio y renueva tu colección sin gastar de más. Puedes
                  cambiar tus juegos de PC usados por otros títulos de igual o
                  menor valor sin costo adicional. Si prefieres un juego de mayor
                  valor, solo tendrás que pagar la diferencia.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  COTIZA UN JUEGO
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¿Buscas el mejor precio para tu próximo videojuego? Con nuestra
                  opción de cotización personalizada, no solo te aseguramos el
                  precio ideal, sino que también puedes aprovechar nuestras
                  ofertas de hoy en una selección única de títulos de PC. ¡No dejes
                  pasar esta oportunidad para ampliar tu colección!
                </p>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/juegosDisp"
                className=" text-[#fff] font-semibold hover:underline"
              >
                Más información
              </a>
            </div>
          </div>
        </section>

        {/* Buy Section */}
        <section className="text-white py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              ¡TE INVITAMOS A CONOCER MÁS JUEGOS!
            </h2>
            <p className="mb-4">
              Explora nuestro catálogo y encuentra el título perfecto para ti.
              Reserva o intercambia tus videojuegos con al menos 7 días de
              anticipación para aprovechar precios especiales y descuentos
              exclusivos. ¡No te pierdas esta oportunidad de ampliar tu colección
              y disfrutar de los mejores juegos a precios increíbles!
            </p>
            <div className="d-flex justify-content-center"></div>
          </div>
        </section>

        {/* Client Section */}
        <section className="client_section layout_padding-bottom">
          <div className="container">
            <h2 className="custom_heading text-center">
              NUESTROS CLIENTES ESTAN FELICES...
            </h2>
            <p className="text-center">
              El 25% de nuestros usuarios consiguió juegos de PC a precios
              increíbles, ¡por $100.000 o menos! Únete a ellos y encuentra los
              mejores títulos a precios inigualables. No dejes pasar esta
              oportunidad para ampliar tu colección y disfrutar de grandes
              aventuras.
            </p>
            {/* Carousel de clientes (puedes mejorarlo con react-bootstrap) */}
            <div
              id="carouselExample2Indicators"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#carouselExample2Indicators"
                  data-slide-to="0"
                  className="active"
                ></li>
                <li
                  data-target="#carouselExample2Indicators"
                  data-slide-to="1"
                ></li>
                <li
                  data-target="#carouselExample2Indicators"
                  data-slide-to="2"
                ></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="layout_padding2 pl-100">
                    <div className="client_container ">
                      <div className="img_box"></div>
                      <div className="detail_box">
                        <h5>EN LA CIUDAD DE BOGOTA.</h5>
                        <p>
                          una tienda en línea de videojuegos para PC que ofrece una
                          amplia variedad de títuloS. Con una interfaz fácil de usar y un
                          proceso de compra rápido, es ideal para quienes buscan
                          descubrir y adquirir juegos de manera sencilla.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="layout_padding2 pl-100">
                    <div className="client_container ">
                      <div className="img_box"></div>
                      <div className="detail_box">
                        <h5>EN LA CIUDAD DE CUCUTA</h5>
                        <p>
                          su opción de intercambio de juegos es un plus para renovar tu
                          biblioteca sin gastar demasiado. El servicio al cliente es
                          eficiente, aunque puede haber pequeños retrasos en horas de
                          alta demanda. En general, ArcadeStore es una opción confiable y
                          accesible para los gamers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="layout_padding2 pl-100">
                    <div className="client_container ">
                      <div className="img_box"></div>
                      <div className="detail_box">
                        <h5>EN LA CIUDAD DE CALI</h5>
                        <p>
                          Con un catálogo bien curado de títulos populares y novedades,
                          esta plataforma se posiciona como una opción atractiva para los
                          jugadores que buscan descubrir, comprar e intercambiar
                          videojuegos digitales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;