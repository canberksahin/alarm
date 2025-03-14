"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Globe, Flag, AlertCircle, ChevronRight, Shield, BarChart2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { countries } from "@/lib/countries"
import Image from "next/image"
import type { JSX } from "react"

// İlgili importları ekleyelim
import { ImageWithFallback } from "@/components/image-with-fallback"

export default function EntryPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  const [matrixChars, setMatrixChars] = useState<JSX.Element[]>([])

  // Matrix code rain effect
  useEffect(() => {
    if (!matrixRef.current) return

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const columns = Math.floor(window.innerWidth / 20)
    const rainDrops: JSX.Element[] = []

    for (let i = 0; i < columns; i++) {
      const speed = Math.random() * 2 + 1
      const duration = Math.random() * 10 + 5
      const delay = Math.random() * 5
      const x = i * 20 + Math.random() * 10
      const char = chars[Math.floor(Math.random() * chars.length)]

      rainDrops.push(
        <span
          key={i}
          style={{
            left: `${x}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {char}
        </span>,
      )
    }

    setMatrixChars(rainDrops)
  }, [])

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
  }

  const handleContinue = () => {
    if (selectedCountry) {
      try {
        console.log("Şu ülkeye yönlendiriliyor:", selectedCountry)
        router.push(`/dashboard/${selectedCountry}`)
      } catch (error) {
        console.error("Yönlendirme hatası:", error)
        // Alternatif olarak window.location.href kullanabiliriz
        window.location.href = `/dashboard/${selectedCountry}`
      }
    }
  }

  // Kart tıklamasını da yönlendirme yapacak şekilde güncelleyelim
  const handleCardClick = (countryCode: string) => {
    setSelectedCountry(countryCode)
    // Karta çift tıklama ile doğrudan yönlendirme
    if (selectedCountry === countryCode) {
      handleContinue()
    }
  }

  return (
    <div className="min-h-screen matrix-bg text-white font-mono relative overflow-hidden">
      {/* Matrix code rain effect */}
      <div ref={matrixRef} className="matrix-code">
        {matrixChars}
      </div>
      <script src="http://localhost:8097"></script>
      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <header className="text-center mb-12 pt-10">
          <div className="flex flex-col items-center justify-center mb-6">
            {/* Logo görüntüleme kısmını güncelleyelim */}
            <div className="relative w-24 h-24 mb-4 logo-glow">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I%CC%87letis%CC%A7im_Bas%CC%A7kanl%C4%B1g%CC%86%C4%B1_logo.svg-5rucsMbOD8GaKOL5W63IQsv7vLTo5V.png"
                alt="İletişim Başkanlığı"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-title font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-500 mb-2">
              Kriz İletişim Monitörü
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-700 rounded-full mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Dünya genelindeki iletişim ve medya haberlerini izleyin, analiz edin ve kritik öneme sahip içerikleri
              tespit edin.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 mb-12">
          <Card className="glass-card border-glow rounded-xl overflow-hidden">
            <CardHeader className="border-b border-green-900/30 pb-4">
              <CardTitle className="text-emerald-400 flex items-center text-xl">
                <Globe className="mr-3 h-6 w-6" />
                Ülke Seçin
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                İzlemek istediğiniz ülkeyi seçin. Her ülke için yerel dildeki haberler analiz edilecektir.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className={`country-card relative cursor-pointer rounded-lg p-4 transition-all ${
                      selectedCountry === country.code
                        ? "glass-effect border-green-500 selected"
                        : "bg-black/40 border border-gray-800 hover:border-green-900"
                    }`}
                    onClick={() => handleCardClick(country.code)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-full h-24 mb-3 shadow-lg overflow-hidden rounded relative group">
                        <ImageWithFallback
                          src={`/flags/${country.code.toLowerCase()}.svg`}
                          alt={`${country.name} Bayrağı`}
                          width={160}
                          height={96}
                          className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                          noSvgOptimization={true}
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-black/20 transition-opacity opacity-50 group-hover:opacity-0"></div>
                      </div>
                      <span className="text-sm text-center font-medium mt-2">{country.name}</span>
                      {selectedCountry === country.code && (
                        <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {/* CardFooter içine harita butonu ekleyelim */}
            <CardFooter className="flex justify-between border-t border-green-900/30 pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-green-900 text-emerald-400 hover:bg-green-900/20 hover-glow"
                  onClick={() => router.push("/critical")}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Kritik Veriler
                </Button>
                <Button
                  variant="outline"
                  className="border-green-900 text-emerald-400 hover:bg-green-900/20 hover-glow"
                  onClick={() => router.push("/map")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Dünya Haritası
                </Button>
              </div>
              <Button
                onClick={handleContinue}
                disabled={!selectedCountry}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 hover-glow"
              >
                Devam Et
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Flag className="mr-2 h-5 w-5 text-emerald-400" />
                Ülke Bazlı İzleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Her ülke için yerel dilde haberler taranır ve analiz edilir. Ülkeye özgü medya kaynakları ve iletişim
                trendleri takip edilir.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart2 className="mr-2 h-5 w-5 text-yellow-500" />
                Gerçek Zamanlı Analiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Yapay zeka destekli analiz motoru, medya içeriklerini gerçek zamanlı olarak değerlendirir ve önem
                derecesine göre sınıflandırır.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                Kritik Veri Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Yüksek öneme sahip haberler otomatik olarak tespit edilir ve ayrı bir sayfada listelenir. Acil müdahale
                gerektiren içerikler için anlık bildirimler alın.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6 rounded-xl mb-12">
          <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5" /> Sistem Özellikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-emerald-900/50 p-2 rounded-lg mr-3">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-300 mb-1">Yapay Zeka Analizi</h3>
                <p className="text-gray-400 text-sm">
                  Gelişmiş yapay zeka algoritmaları ile medya içeriklerinin önemi ve etkisi değerlendirilir.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-emerald-900/50 p-2 rounded-lg mr-3">
                <Globe className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-300 mb-1">Çoklu Dil Desteği</h3>
                <p className="text-gray-400 text-sm">
                  20 farklı ülke ve dilde medya içerikleri analiz edilir ve değerlendirilir.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-emerald-900/50 p-2 rounded-lg mr-3">
                <BarChart2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-300 mb-1">Görsel Raporlama</h3>
                <p className="text-gray-400 text-sm">
                  Analiz sonuçları görsel grafikler ve tablolar ile kolay anlaşılır şekilde sunulur.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-emerald-900/50 p-2 rounded-lg mr-3">
                <AlertCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-emerald-300 mb-1">Kritik Uyarı Sistemi</h3>
                <p className="text-gray-400 text-sm">
                  Yüksek öneme sahip içerikler için otomatik uyarı sistemi ile anında haberdar olun.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 pb-8">
          <div className="flex justify-center items-center mb-4">
            {/* Footer'daki logo */}
            <div className="w-10 h-10 mr-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I%CC%87letis%CC%A7im_Bas%CC%A7kanl%C4%B1g%CC%86%C4%B1_logo.svg-5rucsMbOD8GaKOL5W63IQsv7vLTo5V.png"
                alt="İletişim Başkanlığı"
                width={40}
                height={40}
                className="object-contain opacity-70"
              />
            </div>
            <p className="text-sm">İletişim Başkanlığı Kriz Monitörü &copy; {new Date().getFullYear()}</p>
          </div>
          <p className="text-xs">Tüm hakları saklıdır. Gizlilik ve güvenlik en üst düzeyde sağlanmaktadır.</p>
        </footer>
      </div>
    </div>
  )
}

