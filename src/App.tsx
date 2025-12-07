import { useState, useEffect, useRef } from 'react';
import { analytics } from './utils/analytics';
import { createCartAndGetPhoenixUrl, SHOPIFY_VARIANT_IDS, type PlanId } from './services/shopify-cart';

// Plan data
const plans = [
  {
    id: 'starter' as PlanId,
    name: 'Pruebalo',
    subtitle: 'Para Empezar',
    bottles: 1,
    supply: '1 Mes',
    price: '$19.99',
    priceNum: 19.99,
    originalPrice: '$49.99',
    pricePerBottle: '$19.99',
    savingsAmount: '$30',
    savingsPercent: '60%',
    badge: null,
    popular: false,
    benefits: ['1 Botella', 'Envio Gratis'],
  },
  {
    id: 'builder' as PlanId,
    name: 'Mas Popular',
    subtitle: 'Transformacion Completa',
    bottles: 3,
    supply: '3 Meses',
    price: '$49.99',
    priceNum: 49.99,
    originalPrice: '$149.99',
    pricePerBottle: '$16.66',
    savingsAmount: '$100',
    savingsPercent: '67%',
    freeBottles: 1,
    badge: '73% Eligen Este',
    popular: true,
    benefits: ['Compra 2, Llevate 1 GRATIS', '3 Meses de Suministro', 'Envio Gratis', 'Mejor para resultados visibles'],
  },
  {
    id: 'hourglass' as PlanId,
    name: 'Mejor Valor',
    subtitle: 'Glow-Up Completo',
    bottles: 5,
    supply: '5 Meses',
    price: '$89.99',
    priceNum: 89.99,
    originalPrice: '$249.95',
    pricePerBottle: '$17.99',
    savingsAmount: '$160',
    savingsPercent: '64%',
    freeBottles: 2,
    badge: 'Mejor Valor',
    popular: false,
    benefits: ['Compra 3, Llevate 2 GRATIS', '5 Meses de Suministro', 'Envio Gratis', 'Precio mas bajo por botella'],
  },
];

// Testimonials with Latina names
const testimonials = [
  {
    name: 'Isabella M.',
    age: 26,
    location: 'Miami, FL',
    quote: 'Mi prima me lo recomendo y girl... funciona! En 3 semanas ya noto la diferencia en mis jeans.',
    rating: 5,
    image: '/review-1.png',
  },
  {
    name: 'Valentina R.',
    age: 31,
    location: 'Houston, TX',
    quote: 'Las hierbas naturales me convencieron. Nada de quimicos raros. Y el sabor esta bien!',
    rating: 5,
    image: '/review-2.png',
  },
  {
    name: 'Camila S.',
    age: 24,
    location: 'Los Angeles, CA',
    quote: 'Mi mama siempre me decia que estaba muy flaquita. Ahora hasta ella quiere probarlo jaja',
    rating: 5,
    image: '/review-3.png',
  },
  {
    name: 'Sofia L.',
    age: 29,
    location: 'Phoenix, AZ',
    quote: 'A los 40 me siento mejor que a los 25. Mis curvas estan de vuelta, gracias a Dios.',
    rating: 5,
    image: '/review-4.png',
  },
];

// Ingredients
const ingredients = [
  {
    name: 'Raiz de Maca',
    benefit: 'Usada por generaciones en Peru para energia y curvas naturales',
    description: 'Apoya el estrogeno saludable, guiando la grasa hacia caderas, muslos y booty.',
    image: '/ingredient-maca.png',
  },
  {
    name: 'Fenogreco',
    benefit: 'El secreto de las mujeres del Medio Oriente y Norte de Africa',
    description: 'Por siglos, las mujeres lo han usado para realzar curvas en caderas y muslos.',
    image: '/ingredient-fenugreek.png',
  },
  {
    name: 'Raiz de Remolacha',
    benefit: 'Aumenta el flujo sanguineo a zonas de crecimiento',
    description: 'Incrementa el oxido nitrico, ayudando a que los nutrientes lleguen a tus gluteos.',
    image: '/ingredient-beet.png',
  },
  {
    name: 'Ashwagandha',
    benefit: 'Reduce el cortisol (hormona del estres)',
    description: 'Menos cortisol = menos grasa abdominal. Mas grasa va a caderas y booty.',
    image: '/ingredient-ashwagandha.png',
  },
];

// FAQs
const faqs = [
  {
    question: 'En cuanto tiempo vere resultados?',
    answer: 'La mayoria de nuestras clientas empiezan a notar cambios visibles en 2-4 semanas de uso consistente. Para mejores resultados, recomendamos usarlo por al menos 90 dias.',
  },
  {
    question: 'Es seguro usarlo diariamente?',
    answer: 'Si! Booty Drops esta hecho con ingredientes 100% naturales - hierbas que nuestras abuelas conocian. Completamente seguro para uso diario.',
  },
  {
    question: 'Que pasa si no funciona para mi?',
    answer: 'Ofrecemos garantia de 60 dias. Si no estas completamente satisfecha, contactanos para un reembolso completo. Sin preguntas.',
  },
  {
    question: 'Como lo tomo?',
    answer: 'Simplemente toma 1-2 goteros debajo de la lengua o mezclado con agua/jugo diariamente. Mejor en ayunas para maxima absorcion.',
  },
];

function App() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('builder');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const selectedPlanData = plans.find(p => p.id === selectedPlan)!;

  useEffect(() => {
    // Track view content
    analytics.trackViewContent({
      id: 'booty-drops-latina',
      name: 'Booty Drops',
      price: selectedPlanData.priceNum,
    });

    // Sticky CTA on scroll
    const handleScroll = () => {
      setIsSticky(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);

    analytics.trackAddToCart({
      id: selectedPlan,
      name: `Booty Drops - ${selectedPlanData.name}`,
      price: selectedPlanData.priceNum,
      bundle: selectedPlanData.supply,
    });

    try {
      const checkoutUrl = await createCartAndGetPhoenixUrl(selectedPlan, 1, 'booty-latina-pdp');


      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
      alert('Error al procesar. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Announcement Bar */}
      <div className="bg-terracotta text-white text-center py-2.5 text-sm font-medium overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          ENVIO GRATIS SOLO HOY - 100,000+ CLIENTAS SATISFECHAS - HASTA 60% DE DESCUENTO - ENVIO GRATIS SOLO HOY - 100,000+ CLIENTAS SATISFECHAS - HASTA 60% DE DESCUENTO -
        </div>
      </div>

      {/* Header */}
      <header className="bg-cream/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center">
          <img src="/logo.png" alt="Vanoir" className="h-10" />
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Hero Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-lifestyle.png"
                  alt="Mujer Latina con curvas naturales"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <img src="/5-stars.png" alt="5 estrellas" className="h-5" />
                  <span className="font-semibold text-gray-800">12,000+ resenas</span>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-terracotta/10 text-terracotta px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  El Primer BBL en Botella
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Curvas Que <span className="text-terracotta">Heredaste.</span>
                  <br />
                  <span className="italic text-teal">Naturalmente.</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  Tu cuerpazo te espera. Formula liquida con <span className="font-semibold text-terracotta">hierbas naturales</span> que
                  nuestras abuelas conocian. Resultados en semanas, no meses.
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 py-4 border-y border-gray-200">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`/review-${i}.png`}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">50,000+ mujeres transformadas</p>
                  <p className="text-sm text-gray-500">Mi prima lo probo y funciono</p>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'border-terracotta bg-terracotta/5 shadow-lg ring-2 ring-terracotta/20'
                        : plan.popular
                        ? 'border-terracotta/50 bg-white hover:border-terracotta'
                        : 'border-gray-200 bg-white hover:border-terracotta/50'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-4 bg-terracotta text-white text-xs font-bold px-3 py-1 rounded-full">
                        {plan.badge}
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedPlan === plan.id ? 'border-terracotta bg-terracotta' : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500">{plan.subtitle}</p>
                            <ul className="mt-2 space-y-1">
                              {plan.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <svg className={`w-4 h-4 flex-shrink-0 ${benefit.includes('GRATIS') ? 'text-teal' : 'text-terracotta'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span className={benefit.includes('GRATIS') ? 'font-semibold text-teal' : 'text-gray-600'}>
                                    {benefit}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-terracotta">{plan.price}</div>
                            <div className="text-sm text-gray-400 line-through">{plan.originalPrice}</div>
                            <div className="mt-1 inline-block bg-teal/10 text-teal text-xs font-bold px-2 py-0.5 rounded-full">
                              AHORRA {plan.savingsAmount}
                            </div>
                          </div>
                        </div>

                        {plan.bottles > 1 && (
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>Solo {plan.pricePerBottle}/botella</span>
                            {plan.popular && <span className="text-terracotta font-semibold">Recomendado</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Alert */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-gray-600">Solo <span className="font-bold text-amber-600">14</span> unidades disponibles</span>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-terracotta to-coral text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Procesando...' : `Quiero Mis Curvas - ${selectedPlanData.price}`}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Envio Gratis</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">60 Dias Garantia</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">100% Natural</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Te Sientes <span className="text-terracotta">Flaca</span> Para Tu Cultura?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Sabemos como se siente. Los comentarios de la familia. Las comparaciones con otras mujeres.
                La presion de tener el "cuerpazo" que siempre admiraste.
              </p>
              <ul className="space-y-4">
                {[
                  '"Mija, estas muy flaquita"',
                  '"Por que no tienes curvas como tu prima?"',
                  '"Los hombres quieren mujeres con carne"',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-terracotta text-xl">x</span>
                    <span className="text-gray-700 italic">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-teal font-semibold text-lg">
                Esas palabras duelen. Pero tu transformacion empieza hoy.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/pain-point.png"
                  alt="Momento de reflexion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tu <span className="text-terracotta">Secreto</span> de Belleza Ancestral
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Las mismas hierbas que usaban nuestras abuelas. Ahora en una formula liquida que absorbe 5x mas rapido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/ritual.png"
                alt="Ritual matutino con Booty Drops"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-terracotta/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Paso 1: Gotea Diario</h3>
                    <p className="text-gray-500 text-sm">1 gotero bajo la lengua cada manana</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Paso 2: El Momento Correcto</h3>
                    <p className="text-gray-500 text-sm">En ayunas o 30 min antes del gym</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Paso 3: Ve Tu Transformacion</h3>
                    <p className="text-gray-500 text-sm">Resultados visibles en 2-4 semanas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-16 bg-gradient-to-b from-terracotta/5 to-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal/10 text-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Hierbas Naturales
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              De Generacion en <span className="text-terracotta">Generacion</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ingredientes que nuestras bisabuelas conocian. Probados por siglos, ahora respaldados por ciencia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((ingredient, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10 text-center hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <img src={ingredient.image} alt={ingredient.name} className="w-20 h-20 mx-auto object-contain" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{ingredient.name}</h3>
                <p className="text-terracotta text-sm font-medium mb-2">{ingredient.benefit}</p>
                <p className="text-gray-500 text-sm">{ingredient.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo Que Dicen <span className="text-terracotta">Nuestras Clientas</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/5-stars.png" alt="5 estrellas" className="h-6" />
              <span className="text-lg font-semibold text-gray-700">4.9/5 de 12,000+ resenas</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-cream rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-terracotta/30"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">{testimonial.name}</span>
                      <img src="/verified-check.svg" alt="Verificada" className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{testimonial.age} anos - {testimonial.location}</p>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">*</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Image */}
          <div className="mt-12 max-w-sm mx-auto">
            <img
              src="/social-proof.png"
              alt="Testimonial de Instagram"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mira Los <span className="text-terracotta">Resultados</span>
            </h2>
            <p className="text-gray-600 text-lg">Videos reales de clientas reales</p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                onClick={() => setActiveVideo(`/videos/reel-0${i}.mp4`)}
                className="relative aspect-[9/16] min-w-[200px] w-[200px] md:w-auto md:min-w-0 flex-shrink-0 md:flex-shrink rounded-2xl overflow-hidden shadow-xl cursor-pointer group snap-center"
              >
                <video
                  src={`/videos/reel-0${i}.mp4`}
                  poster={`/videos/thumb-0${i}.jpg`}
                  preload="none"
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-terracotta ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="max-w-lg w-full">
            <video
              src={activeVideo}
              className="w-full rounded-2xl"
              controls
              autoPlay
            />
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preguntas <span className="text-terracotta">Frecuentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-cream rounded-2xl border border-gold/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-terracotta/5 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-terracotta flex-shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-b from-terracotta/10 to-cream">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img src="/transformation.png" alt="Transformacion" className="w-64 h-64 mx-auto rounded-full object-cover shadow-2xl mb-8" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tu <span className="text-terracotta">Cuerpazo</span> Te Espera
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Unete a las 50,000+ mujeres que dejaron de esperar y empezaron a transformarse.
          </p>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-gradient-to-r from-terracotta to-coral text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : `Empezar Mi Transformacion - ${selectedPlanData.price}`}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Garantia de 60 dias - Envio gratis - Pago seguro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <img src="/logo.png" alt="Vanoir" className="h-8 mx-auto mb-4 brightness-0 invert" />
          <p className="text-gray-400 text-sm mb-4">
            Curvas naturales. Confianza real.
          </p>
          <p className="text-gray-500 text-xs">
            2024 Vanoir. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl z-50 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="text-xs text-gray-500">Desde</div>
              <div className="font-bold text-lg text-terracotta">{selectedPlanData.price}</div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-terracotta to-coral text-white font-bold py-4 rounded-xl"
            >
              {isLoading ? 'Cargando...' : 'Quiero Mis Curvas'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
