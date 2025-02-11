import { Metadata } from 'next'
import Link from 'next/link'

import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
} from '@/components/icons'
import FaleConoscoForm from '@/components/forms/fale-conosco-form'

export const metadata: Metadata = {
  title: 'DoctorExe',
  description: 'Página inicial do DoctorExe',
  /*   keywords:
    '', */
}

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden h-screen">
      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 to-blue-700 py-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">FisioSport</h1>
              <h2 className="text-2xl text-blue-100 mb-8">
                Fisioterapia Esportiva de Alto Desempenho
              </h2>

              <div className="space-y-4">
                <p className="text-white text-lg">
                  Especialistas em recuperação e prevenção de lesões esportivas
                </p>
                <p className="text-white text-lg">
                  Atendimento personalizado para atletas de todas as modalidades
                </p>
              </div>

              <div className="flex justify-center gap-6 mt-12">
                <Link
                  href="https://www.instagram.com/fisiosport.cfd"
                  className="text-white hover:text-blue-200"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://www.facebook.com/FisioSport.CFD "
                  className="text-white hover:text-blue-200"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="https://www.youtube.com/channel/UCbEALNjyCcS_pb0w5o7ne0g"
                  className="text-white hover:text-blue-200"
                >
                  <YoutubeIcon />
                </Link>
              </div>

              <Link
                href="/entrar"
                className="inline-block mt-12 px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-100 transition-colors"
              >
                Acessar Sistema
              </Link>
            </div>
          </div>
        </section>

        {/* Produtos Afiliados */}
        {/*       <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Catálogo de Produtos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="Catálogo WhatsApp"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Disponível
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mt-6">
                  Catálogo Completo
                </h3>
                <p className="text-gray-600 mt-2">
                  Acesse nosso catálogo completo no WhatsApp e confira todos os
                  produtos disponíveis
                </p>
                <Link
                  href="https://wa.me/p/7654801044633348/553299942252"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full mt-6 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <WhatsAppIcon />
                  Ver no WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </section> */}

        {/* WhatsApp Float Button */}
        <Link
          href="https://wa.me/+553299942252"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center w-14 h-14"
          target="_blank"
        >
          <WhatsAppIcon />
        </Link>

        {/* Formulário de Contato */}
        <section className="py-16 bg-gray-100">
          <FaleConoscoForm />
        </section>
      </main>
    </div>
  )
}
