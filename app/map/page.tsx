"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Home, AlertCircle, Globe, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { countries } from "@/lib/countries"
import { mockCriticalData } from "@/lib/mock-data"
import type { JSX } from "react"
// Leaflet importları - not: next.js client side dynamic import kullanıyoruz
import dynamic from 'next/dynamic'

// Leaflet CSS stillerini globals.css'de import ediyoruz

// Leaflet bileşenlerini client-side olarak yüklüyoruz (SSR sorunlarını önlemek için)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
)

export default function WorldMapPage() {
  const url = '/marker-red.png'
  const router = useRouter()
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: number; country: string; score: number }>>([])
  const matrixRef = useRef<HTMLDivElement>(null)
  const [matrixChars, setMatrixChars] = useState<JSX.Element[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [L, setL] = useState<any>(null)

  // Leaflet için dynamic import (client-side için)
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet)
      setIsMapLoaded(true)
    }).catch(err => {
      console.error("Leaflet yüklenemedi:", err)
      setMapError(true)
    })
  }, [])

  // Özel marker icon oluşturma fonksiyonu
  const createCustomIcon = useMemo(() => {
    if (!L) return null

    return (score: number) => {
      const size = score < 9 ? 24 : score < 10 ? 30 : 36
      
      return new L.Icon({
        iconUrl: '/marker-red.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [size, size],
        iconAnchor: [size/2, size],
        popupAnchor: [0, -size],
        shadowSize: [size + 10, size + 10],
        shadowAnchor: [(size/2) + 5, size + 10],
        className: 'pulse-marker'
      })
    }
  }, [L])

  // Kritik verileri filtrele
  const criticalItems = useMemo(() => {
    return mockCriticalData.filter((item) => item.score >= 8)
  }, [])

  // Ülke koordinatları
  const countryCoordinates: Record<string, [number, number]> = {
    FR: [46.2276, 2.2137],
    DE: [51.1657, 10.4515],
    ES: [40.4637, -3.7492],
    IT: [41.8719, 12.5674],
    GB: [55.3781, -3.436],
    US: [37.0902, -95.7129],
    TR: [38.9637, 35.2433],
    RU: [61.524, 105.3188],
    CN: [35.8617, 104.1954],
    JP: [36.2048, 138.2529],
    BR: [-14.235, -51.9253],
    IN: [20.5937, 78.9629],
    CA: [56.1304, -106.3468],
    AU: [-25.2744, 133.7751],
    ZA: [-30.5595, 22.9375],
    MX: [23.6345, -102.5528],
    AR: [-38.4161, -63.6167],
    EG: [26.8206, 30.8025],
    SA: [23.8859, 45.0792],
    KR: [35.9078, 127.7669],
  }

  // Skor aralığına göre marker boyutu hesapla
  const getMarkerSize = (score: number) => {
    return score < 9 ? 8 : score < 10 ? 12 : 16
  }

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

  useEffect(() => {
    // Harita yükleme işlemi
    try {
      // Kritik verileri filtrele
      const criticalData = mockCriticalData.filter((item) => item.score >= 8)

      // Aktif alarmları güncelle
      setActiveAlerts(
        criticalData.map((item) => ({
          id: item.id,
          country: item.country,
          score: item.score,
        })),
      )
    } catch (error) {
      console.error("Harita yüklenirken bir hata oluştu:", error)
      setMapError(true)
    }
  }, [])

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.code === code)
    return country ? country.name : code
  }

  // Marker verileri oluştur
  const markers = useMemo(() => {
    return criticalItems.map((item) => {
      const coords = countryCoordinates[item.country] || [0, 0]
      const countryName = getCountryName(item.country)
      return {
        id: item.id,
        name: countryName,
        position: coords,
        title: item.title,
        score: item.score,
        country: item.country,
      }
    })
  }, [criticalItems])

  // Harita stilleri
  const mapStyles = {
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,0.8)',
  }

  return (
    
    <div className="min-h-screen matrix-bg text-white font-mono relative overflow-hidden">
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
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400">Dünya Haritası</span>
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
            <Badge variant="destructive" className="animate-pulse">
              {activeAlerts.length} KRİTİK ALARM
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-3">
            <Card className="glass-card border-glow h-[70vh] overflow-hidden relative">
              {!isMapLoaded ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                  <p className="text-emerald-400">Harita yükleniyor...</p>
                </div>
              ) : mapError ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <p className="text-red-400">Harita yüklenirken bir hata oluştu.</p>
                </div>
              ) : (
                <div className="w-full h-full">
                  <MapContainer
                    center={[30, 0]} // Başlangıç merkezi
                    zoom={2}
                    style={mapStyles}
                    attributionControl={false}
                    zoomControl={false}
                  >
                    {/* Farklı harita stil seçenekleri: */}
                    
                    {/* Karanlık tem harita - Matrix temasına daha uygun */}
                    <TileLayer
                      attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                      url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=190dee42-0899-4d47-8111-c4dc63ca4d75"
                    />
                    
                    {/* Alternatif olarak normal OpenStreetMap */}
                    {/* <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?api_key=190dee42-0899-4d47-8111-c4dc63ca4d75"
                    /> */}
                    
                    {/* Krizleri gösteren markerlar */}
                    {markers.map((marker) => (
                      
                      <Marker
                        key={marker.id}
                        position={marker.position}
                       // icon={createCustomIcon ? createCustomIcon(marker.score)}
                        eventHandlers={{
                          click: () => {
                            try {
                              console.log(`Nokta tıklandı: ${marker.country}`)
                              router.push(`/dashboard/${marker.country}`)
                            } catch (error) {
                              console.error("Yönlendirme hatası:", error)
                              window.location.href = `/dashboard/${marker.country}`
                            }
                          }
                        }}
                      >
                        <Tooltip 
                          direction="top"
                          offset={[0, -10]}
                          opacity={0.9}
                          className="matrix-tooltip"
                        >
                          <div className="text-xs font-mono">
                            <span className="font-bold text-red-400">{marker.name}</span>
                            <div className="mt-1 text-green-300">{marker.title}</div>
                            <div className="mt-1">Önem: <span className="text-red-500 font-bold">{marker.score}/10</span></div>
                          </div>
                        </Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-xs text-gray-400 z-20">
                * Harita üzerindeki kırmızı noktalar kritik öneme sahip verileri göstermektedir.
              </div>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card className="glass-card border-red-900/30 h-[70vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-red-900/30 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-lg font-medium text-red-400">Aktif Alarmlar</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {activeAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {activeAlerts.map((alert) => (
                      <Card
                        key={alert.id}
                        className="bg-black/50 border-red-900/30 p-3 hover:bg-black/70 transition-colors"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-4 mr-2 shadow-sm relative overflow-hidden flex-shrink-0 rounded">
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url('/flags/${alert.country.toLowerCase()}.svg')`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{getCountryName(alert.country)}</span>
                          <Badge variant="destructive" className="ml-auto text-xs">
                            {alert.score}/10
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-red-400 hover:bg-red-900/20"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            try {
                              console.log(`Buton tıklandı: ${alert.country}`)
                              router.push(`/dashboard/${alert.country}`)
                            } catch (error) {
                              console.error("Yönlendirme hatası:", error)
                              window.location.href = `/dashboard/${alert.country}`
                            }
                          }}
                        >
                          <ArrowLeft className="h-3 w-3 mr-1" />
                          Monitöre Git
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <AlertCircle className="h-12 w-12 mb-2 opacity-20" />
                    <p>Aktif alarm bulunmamaktadır</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <footer className="text-center text-gray-500 pb-8">
          <p className="text-xs">İletişim Başkanlığı Kriz Monitörü &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  )
}

