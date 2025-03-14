"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertCircle, BarChart2, Home, Zap, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countries } from "@/lib/countries"
import type { JSX } from "react"
// İlgili importları ekleyelim
import { ImageWithFallback } from "@/components/image-with-fallback"
import Image from "next/image"

export default function Dashboard({ params }: { params: { country: string } }) {
  const router = useRouter()
  
  // Dinamik route parametresi için bir state kullanacağız
  const [countryCode, setCountryCode] = useState<string>("FR")
  const [currentCountry, setCurrentCountry] = useState(countries.find((c) => c.code === "FR") || { 
    code: "FR", 
    name: "Fransa", 
    language: "Fransızca" 
  })
  
  // Component mount olduğunda params'tan country kodunu alıp state'e aktaralım
  useEffect(() => {
    if (params && params.country) {
      const code = params.country
      setCountryCode(code)
      
      const countryData = countries.find((c) => c.code === code)
      if (countryData) {
        setCurrentCountry(countryData)
      }
    }
  }, [params])

  const [logs, setLogs] = useState<
    Array<{
      id: number
      text: string
      score: number
      timestamp: string
      type: "search" | "analysis" | "result"
    }>
  >([])
  const [isRunning, setIsRunning] = useState(false)
  const [searchTerm, setSearchTerm] = useState("iletişim medya")
  const logContainerRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  const [matrixChars, setMatrixChars] = useState<JSX.Element[]>([])
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    medium: 0,
    low: 0,
  })

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

  // Simulate fetching and analyzing news
  const fetchAndAnalyzeNews = async () => {
    if (!isRunning) return

    // Log search start
    addLog(`Arama başlatıldı: "${searchTerm}" ile ilgili ${currentCountry.language} haberler`, 0, "search")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate found article
    const mockArticles: Record<string, string[]> = {
      FR: [
        "Les médias français face à la crise de confiance du public",
        "Communication politique: nouvelles stratégies à l'ère numérique",
        "Les réseaux sociaux transforment la communication institutionnelle",
        "Crise sanitaire: l'importance d'une communication transparente",
      ],
      DE: [
        "Deutsche Medien im digitalen Wandel",
        "Kommunikationsstrategie der Bundesregierung",
        "Soziale Medien und politische Kommunikation in Deutschland",
        "Krisenkommunikation während der Pandemie",
      ],
      ES: [
        "Los medios de comunicación españoles en la era digital",
        "Estrategias de comunicación política en España",
        "El impacto de las redes sociales en la comunicación institucional",
        "Comunicación de crisis durante emergencias nacionales",
      ],
      IT: [
        "I media italiani nell'era digitale",
        "Strategie di comunicazione politica in Italia",
        "L'impatto dei social media sulla comunicazione istituzionale",
        "Comunicazione di crisi durante le emergenze nazionali",
      ],
      GB: [
        "British media facing digital transformation challenges",
        "Political communication strategies in the UK",
        "Social media impact on institutional communication",
        "Crisis communication during national emergencies",
      ],
      US: [
        "American media landscape transformation",
        "White House communication strategies",
        "Social media's role in government messaging",
        "Crisis communication during national disasters",
      ],
      TR: [
        "Türk medyasının dijital dönüşümü",
        "Siyasi iletişim stratejileri ve Türkiye",
        "Sosyal medyanın kurumsal iletişime etkisi",
        "Ulusal krizlerde iletişim yönetimi",
      ],
    }

    const countryArticles = mockArticles[countryCode] || mockArticles.FR
    const randomArticle = countryArticles[Math.floor(Math.random() * countryArticles.length)]
    addLog(`Haber bulundu: "${randomArticle}"`, 0, "search")

    // Simulate AI analysis
    addLog(`İletişim başkanlığı için haber önemi analiz ediliyor...`, 0, "analysis")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate random score between 1-10
    const score = Math.floor(Math.random() * 10) + 1
    addLog(`Analiz tamamlandı. Önem puanı: ${score}/10`, score, "result")

    // Update stats
    setStats((prev) => {
      const newStats = { ...prev, total: prev.total + 1 }
      if (score > 7) newStats.critical = prev.critical + 1
      else if (score >= 4) newStats.medium = prev.medium + 1
      else newStats.low = prev.low + 1
      return newStats
    })

    // Schedule next fetch if still running
    if (isRunning) {
      setTimeout(fetchAndAnalyzeNews, 3000)
    }
  }

  const addLog = (text: string, score: number, type: "search" | "analysis" | "result") => {
    const newLog = {
      id: Date.now(),
      text,
      score,
      timestamp: new Date().toLocaleTimeString(),
      type,
    }

    setLogs((prevLogs) => {
      // Keep only the last 100 logs to prevent performance issues
      const updatedLogs = [newLog, ...prevLogs].slice(0, 100)
      return updatedLogs
    })
  }

  const toggleMonitoring = () => {
    setIsRunning((prev) => !prev)
  }

  // Start/stop monitoring when isRunning changes
  useEffect(() => {
    if (isRunning) {
      fetchAndAnalyzeNews()
    }
  }, [isRunning])

  // Auto-scroll to the latest log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [logs])

  const getLogColor = (score: number) => {
    if (score === 0) return "text-blue-400" // For process logs
    if (score > 7) return "text-red-500"
    if (score >= 4) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="flex flex-col min-h-screen matrix-bg text-green-500 font-mono relative overflow-hidden">
      {/* Matrix code rain effect */}
      <div ref={matrixRef} className="matrix-code">
        {matrixChars}
      </div>

      <div className="p-6 relative z-10">
        <header className="flex items-center justify-between mb-6 glass-card p-4 rounded-xl backdrop-blur-sm border-glow">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-900/20"
            >
              <Home className="h-5 w-5" />
            </Button>
            {/* Logo görüntüleme kısmını güncelleyelim */}
            <div className="relative w-10 h-10 mr-1 logo-glow">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I%CC%87letis%CC%A7im_Bas%CC%A7kanl%C4%B1g%CC%86%C4%B1_logo.svg-5rucsMbOD8GaKOL5W63IQsv7vLTo5V.png"
                alt="İletişim Başkanlığı"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-lg font-title font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-500">
              Kriz İletişim Monitörü
            </h1>
            {/* Bayrak görüntüleme kısmını güncelleyelim */}
            <div
              className="w-6 h-4 mr-2 shadow-sm relative overflow-hidden flex-shrink-0 rounded"
              title={`${currentCountry.name} Veri Kaynağı`}
            >
              <ImageWithFallback
                src={`/flags/${countryCode.toLowerCase()}.svg`}
                alt={`${currentCountry.name} Bayrağı`}
                width={24}
                height={16}
                className="w-full h-full object-cover"
                noSvgOptimization={true}
                unoptimized={true}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/critical")}
              className="border-red-900/50 text-red-400 hover:bg-red-900/20 hover-glow"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Kritik Veriler
            </Button>
            <Badge variant={isRunning ? "destructive" : "outline"} className={isRunning ? "animate-pulse" : ""}>
              {isRunning ? "İZLEME AKTİF" : "İZLEME PASİF"}
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="glass-card border-glow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300 mb-1">Toplam Analiz</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </Card>
          <Card className="glass-card border-red-900/50 border-glow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300 mb-1">Kritik Önem</p>
            <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
          </Card>
          <Card className="glass-card border-yellow-900/50 border-glow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300 mb-1">Orta Önem</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.medium}</p>
          </Card>
          <Card className="glass-card border-green-900/50 border-glow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300 mb-1">Düşük Önem</p>
            <p className="text-3xl font-bold text-green-500">{stats.low}</p>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
            <Input
              type="text"
              placeholder={`Arama terimleri (${currentCountry.language} için)`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 glass-card border-emerald-900/50 text-emerald-500 rounded-lg"
            />
          </div>
          <Button
            onClick={toggleMonitoring}
            className={`py-6 px-8 hover-glow ${
              isRunning
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                İZLEMEYİ DURDUR
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                İZLEMEYİ BAŞLAT
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="logs" className="flex-1">
          <TabsList className="glass-card border border-emerald-900/50">
            <TabsTrigger value="logs" className="data-[state=active]:bg-emerald-900/30">
              Gerçek Zamanlı Loglar
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-900/30">
              Gösterge Paneli
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="flex-1 mt-4">
            <Card className="flex-1 glass-card border-emerald-900/50 overflow-hidden rounded-xl backdrop-blur-sm">
              <div
                ref={logContainerRef}
                className="h-[calc(100vh-400px)] overflow-y-auto flex flex-col-reverse p-6 font-mono text-sm"
              >
                {logs.map((log) => (
                  <div key={log.id} className="mb-3 flex items-start animate-matrixFadeIn">
                    <span className="text-emerald-400 mr-3 opacity-70">[{log.timestamp}]</span>
                    <span className={`${getLogColor(log.score)}`}>
                      {log.text}
                      {log.type === "result" && (
                        <span className="ml-2">
                          {log.score > 7 ? <AlertCircle className="inline h-4 w-4 text-red-500 ml-1" /> : null}
                        </span>
                      )}
                    </span>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-gray-500 italic flex flex-col items-center justify-center h-full">
                    <BarChart2 className="h-16 w-16 mb-4 opacity-20" />
                    <p>Henüz izleme verisi yok. İzlemeyi başlatmak için "İZLEMEYİ BAŞLAT" düğmesine tıklayın.</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-4">
            <Card className="glass-card border-emerald-900/50 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" /> Önem Dağılımı
              </h2>
              <div className="flex h-40 items-end gap-2 mb-6">
                <div
                  className="bg-gradient-to-t from-red-700 to-red-500 w-1/3 rounded-t-md relative group transition-all hover:opacity-90"
                  style={{ height: `${(stats.critical / Math.max(stats.total, 1)) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs">
                    {stats.critical} Kritik
                  </div>
                </div>
                <div
                  className="bg-gradient-to-t from-yellow-700 to-yellow-500 w-1/3 rounded-t-md relative group transition-all hover:opacity-90"
                  style={{ height: `${(stats.medium / Math.max(stats.total, 1)) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs">
                    {stats.medium} Orta
                  </div>
                </div>
                <div
                  className="bg-gradient-to-t from-green-700 to-green-500 w-1/3 rounded-t-md relative group transition-all hover:opacity-90"
                  style={{ height: `${(stats.low / Math.max(stats.total, 1)) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs">
                    {stats.low} Düşük
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-emerald-900/50 p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Kritik Önem Oranı</h3>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.total ? Math.round((stats.critical / stats.total) * 100) : 0}%
                  </p>
                </Card>
                <Card className="glass-card border-emerald-900/50 p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Orta Önem Oranı</h3>
                  <p className="text-2xl font-bold text-yellow-500">
                    {stats.total ? Math.round((stats.medium / stats.total) * 100) : 0}%
                  </p>
                </Card>
                <Card className="glass-card border-emerald-900/50 p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Düşük Önem Oranı</h3>
                  <p className="text-2xl font-bold text-green-500">
                    {stats.total ? Math.round((stats.low / stats.total) * 100) : 0}%
                  </p>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-6 text-center text-xs text-gray-500">
          İletişim Başkanlığı Kriz Monitörü &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}

