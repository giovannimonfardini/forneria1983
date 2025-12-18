import Link from 'next/link';

const menuItems = [
  {
    href: '/pizzas',
    title: 'Cardápio de Pizzas',
    description: 'Nossas pizzas artesanais em português',
    icon: '🍕',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    href: '/pizzas-ingles',
    title: 'Pizza Menu',
    description: 'Our artisan pizzas in English',
    icon: '🌍',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/forneria-praia',
    title: 'Cardápio da Praia',
    description: 'Menu especial da nossa unidade na praia',
    icon: '🏖️',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/30 mb-8">
              <span className="text-4xl sm:text-5xl">🔥</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Forneria{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                1983
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-2">
              Tradição e sabor desde 1983
            </p>
            <p className="text-zinc-500">
              Escolha um cardápio para visualizar
            </p>
          </div>
        </div>
      </header>

      {/* Menu Cards */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-300"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

              <div className="relative h-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg mb-6`}>
                  <span className="text-3xl sm:text-4xl">{item.icon}</span>
                </div>

                {/* Content */}
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {item.description}
                </p>

                {/* Arrow */}
                <div className="mt-6 flex items-center text-amber-500 font-medium">
                  <span className="mr-2">Ver cardápio</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-zinc-500 text-sm">
            © {new Date().getFullYear()} Forneria 1983. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
