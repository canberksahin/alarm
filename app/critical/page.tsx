"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Home, Filter, Clock, ArrowUpDown, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/lib/countries"
import Image from "next/image"

// Mock critical data
const mockCriticalData = [
  {
    id: 1,
    title: "Les médias français face à la crise de confiance du public",
    country: "FR",
    score: 9,
    timestamp: "2025-03-14T08:30:00",
    summary:
      "Une analyse approfondie de la crise de confiance envers les médias français et ses implications pour la communication gouvernementale.",
  },
  {
    id: 2,
    title: "Deutsche Medien im digitalen Wandel: Kritische Entwicklungen",
    country: "DE",
    score: 8,
    timestamp: "2025-03-14T07:45:00",
    summary:
      "Eine Untersuchung der kritischen Entwicklungen in der deutschen Medienlandschaft während des digitalen Wandels.",
  },
  {
    id: 3,
    title: "Crisis Communication Failures in UK Government Response",
    country: "GB",
    score: 10,
    timestamp: "2025-03-14T06:15:00",
    summary:
      "Analysis of recent communication failures in UK government crisis response and their impact on public trust.",
  },
  {
    id: 4,
    title: "Türk medyasının dijital dönüşümünde kritik sorunlar",
    country: "TR",
    score: 8,
    timestamp: "2025-03-14T09:20:00",
    summary:
      "Türk medyasının dijital dönüşüm sürecinde karşılaştığı kritik sorunların analizi ve iletişim stratejilerine etkisi.",
  },
  {
    id: 5,
    title: "White House Communication Strategy Under Fire",
    country: "US",
    score: 9,
    timestamp: "2025-03-13T22:10:00",
    summary:
      "Critical analysis of recent White House communication strategies and their effectiveness during national crises.",
  },
  {
    id: 6,
    title: "Los medios españoles y la desinformación: crisis de credibilidad",
    country: "ES",
    score: 8,
    timestamp: "2025-03-13T18:45:00",
    summary:
      "Análisis de la crisis de credibilidad en los medios españoles debido a la desinformación y su impacto en la comunicación institucional.",
  },
  {
    id: 7,
    title: "I media italiani e la crisi di fiducia: impatto sulla comunicazione governativa",
    country: "IT",
    score: 8,
    timestamp: "2025-03-13T16:30:00",
    summary: "Analisi della crisi di fiducia nei media italiani e del suo impatto sulla comunicazione governativa.",
  },
]

export default function CriticalDataPage() {
  const router = useRouter()
  const [criticalData, setCriticalData] = useState(mockCriticalData)
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest")

  // Apply filters and sorting
  useEffect(() => {
    let filteredData = [...mockCriticalData]

    // Apply country filter
    if (countryFilter !== "all") {
      filteredData = filteredData.filter((item) => item.country === countryFilter)
    }

    // Apply sorting
    if (sortOrder === "newest") {
      filteredData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else if (sortOrder === "oldest") {
      filteredData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    } else if (sortOrder === "highest") {
      filteredData.sort((a, b) => b.score - a.score)
    }

    setCriticalData(filteredData)
  }, [countryFilter, sortOrder])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.code === code)
    return country ? country.name : code
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 bg-black/50 p-4 rounded-lg backdrop-blur-sm border border-red-900/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-green-500 hover:text-green-400 hover:bg-green-900/20"
            >
              <Home className="h-5 w-5" />
            </Button>
            <div className="relative w-10 h-10 mr-1">
              <Image src="/logo.svg" alt="İletişim Başkanlığı" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-lg font-light bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500">
              Kritik Önem Verileri
            </h1>
          </div>
          {/* Harita butonunu ekleyelim */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/map")}
              className="border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/20 hover-glow"
            >
              <Globe className="mr-2 h-4 w-4" />
              Haritada Göster
            </Button>
            <Badge variant="destructive" className="animate-pulse">
              {criticalData.length} KRİTİK VERİ
            </Badge>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Ülke Filtresi:</span>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px] bg-black/50 border-gray-700">
                <SelectValue placeholder="Tüm Ülkeler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Ülkeler</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Sıralama:</span>
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="w-[180px] bg-black/50 border-gray-700">
                <SelectValue placeholder="En Yeniler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">En Yeniler</SelectItem>
                <SelectItem value="oldest">En Eskiler</SelectItem>
                <SelectItem value="highest">En Yüksek Puan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {criticalData.length > 0 ? (
            criticalData.map((item) => (
              <Card key={item.id} className="bg-black/50 border-red-900/30 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-4 shadow-sm relative overflow-hidden flex-shrink-0 rounded">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/flags/${item.country.toLowerCase()}.svg')`,
                          }}
                        ></div>
                      </div>
                      <Badge variant="outline" className="text-gray-400 border-gray-700">
                        {getCountryName(item.country)}
                      </Badge>
                      <Badge variant="destructive">Önem: {item.score}/10</Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-red-400">{item.title}</CardTitle>
                  <CardDescription className="text-gray-400 mt-2">{item.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-red-900/50 text-red-400 hover:bg-red-900/20"
                      onClick={() => router.push(`/dashboard/${item.country}`)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ülke Monitörüne Git
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-12 bg-black/30 rounded-lg border border-gray-800">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Kritik Veri Bulunamadı</h3>
              <p className="text-gray-500">Seçilen filtrelere uygun kritik önem düzeyinde veri bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

