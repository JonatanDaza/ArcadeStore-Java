'use client';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
    });
    const [enviado, setEnviado] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Aquí puedes enviar el formulario a tu backend o servicio de correo
        setEnviado(true);
        // Limpia el formulario si quieres
        // setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#06174d]">
            <Header />
            <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-0">
                <h1 className="text-3xl font-bold mb-6 text-center">Biblioteca</h1>
            </main>
            <Footer />
        </div>
    );
}