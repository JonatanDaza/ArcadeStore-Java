import { useState, useEffect, useRef } from "react"

const carouselItems = [
  {
    title: "EN LA CIUDAD DE BOGOTA.",
    text:
      "Una tienda en línea de videojuegos para PC que ofrece una amplia variedad de títulos. Con una interfaz fácil de usar y un proceso de compra rápido, es ideal para quienes buscan descubrir y adquirir juegos de manera sencilla.",
  },
  {
    title: "EN LA CIUDAD DE CUCUTA",
    text:
      "Su opción de intercambio de juegos es un plus para renovar tu biblioteca sin gastar demasiado. El servicio al cliente es eficiente, aunque puede haber pequeños retrasos en horas de alta demanda. En general, ArcadeStore es una opción confiable y accesible para los gamers.",
  },
  {
    title: "EN LA CIUDAD DE CALI",
    text:
      "Con un catálogo bien curado de títulos populares y novedades, esta plataforma se posiciona como una opción atractiva para los jugadores que buscan descubrir, comprar e intercambiar videojuegos digitales.",
  },
];

export default function CarouselClientes() {
  const [active, setActive] = useState(0);
  const interval = 5000; // 5 segundos
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => setActive(idx);

  return (
    <div>
      <div className="w-full max-w-2xl mx-auto relative mt-8">
        {/* Carousel Items */}
        <div className="overflow-hidden rounded-lg border-1 border-[#606060] border-radius">
          <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${active * 100}%)` }}>
            {carouselItems.map((item, idx) => (
              <div key={idx} className="min-w-full flex flex-col items-center p-8">
                <div className="text-center">
                  <h5 className="text-lg font-bold text-white mb-2">{item.title}</h5>
                  <p className="text-white">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-3 h-3 rounded-full ${active === idx ? "bg-black" : "bg-white"} transition`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
