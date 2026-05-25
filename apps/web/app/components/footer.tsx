'use client';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-500 font-medium">
        <p>© {new Date().getFullYear()} ReStock — Inventario inteligente para negocios pequeños.</p>
        <p className="text-gray-400">Hecho para ayudar a tu negocio.</p>
      </div>
    </footer>
  );
}