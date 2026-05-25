'use client';
import { useState } from "react";
import { Check, AlertCircle, Loader } from "lucide-react";

export function CTA() {
  const [form, setForm] = useState({ name: "", business: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(() => {
    if (typeof window === "undefined") return 127;
    return Number(localStorage.getItem("restock_signups") ?? 127);
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.business || !/^[\d+\s()-]{7,}$/.test(form.phone)) return;
    
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
      const response = await fetch(`${apiUrl}/cta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.name,
          negocio: form.business,
          telefono: form.phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el interés');
      }

      const next = count + 1;
      setCount(next);
      if (typeof window !== "undefined") {
        localStorage.setItem("restock_signups", String(next));
        const list = JSON.parse(localStorage.getItem("restock_leads") ?? "[]");
        list.push({ ...form, at: new Date().toISOString() });
        localStorage.setItem("restock_leads", JSON.stringify(list));
      }
      setSubmitted(true);
      setForm({ name: "", business: "", phone: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="px-6 pb-24 pt-8 bg-white">
      <div
        className="mx-auto max-w-5xl rounded-3xl p-10 md:p-16 text-white relative overflow-hidden bg-[#00a365] shadow-[0_10px_40px_rgba(0,163,101,0.15)]"
      >
        {/* Patrón de puntos decorativos de fondo */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        
        <div className="relative grid md:grid-cols-2 gap-12 items-center z-10">
          {/* Bloque Izquierdo: Textos */}
          <div>
            <h2 className="text-3xl md:text-[44px] font-extrabold leading-[1.1] tracking-tight">
              Empieza a cuidar tu inventario hoy.
            </h2>
            <p className="mt-5 text-base md:text-lg text-white/90 leading-relaxed">
              Déjanos tus datos y te contactaremos para darte acceso anticipado a ReStock.
            </p>
            <p className="mt-8 text-sm text-white/80 font-medium">
              <span className="font-bold underline decoration-white/40">No pierdas esta oportunidad</span> registrate ahora 
            </p>
          </div>

          {/* Bloque Derecho: Formulario */}
          <form
            onSubmit={onSubmit}
            className="bg-[#fcfdfd] text-gray-900 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl border border-white/20"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-name" className="text-sm font-bold text-gray-800">
                Nombre
              </label>
              <input
                id="cta-name"
                required
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder="Tu nombre"
                className="w-full h-11 px-4 rounded-xl border border-gray-200/90 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-business" className="text-sm font-bold text-gray-800">
                Negocio
              </label>
              <input
                id="cta-business"
                required
                type="text"
                value={form.business}
                onChange={onChange("business")}
                placeholder="Abarrotes Don Pepe"
                className="w-full h-11 px-4 rounded-xl border border-gray-200/90 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-phone" className="text-sm font-bold text-gray-800">
                Número de teléfono
              </label>
              <input
                id="cta-phone"
                type="tel"
                required
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="+52 555 123 4567"
                className="w-full h-11 px-4 rounded-xl border border-gray-200/90 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl bg-[#00a365] hover:bg-[#008c54] disabled:bg-gray-400 text-white font-bold text-sm tracking-wide transition shadow-md shadow-[#00a365]/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Registrando...
                </>
              ) : (
                'Reservar mi lugar'
              )}
            </button>
            
            {submitted && (
              <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2 mt-2 justify-center bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                <Check className="w-4 h-4 stroke-[3]" /> ¡Gracias! Te contactaremos pronto.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600 font-semibold flex items-center gap-2 mt-2 justify-center bg-red-50 py-2 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}