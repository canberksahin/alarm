"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { AlertCircle } from "lucide-react"

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string
  noSvgOptimization?: boolean
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = "/placeholder.svg", 
  noSvgOptimization = false,
  ...rest 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc)

  useEffect(() => {
    setImageSrc(src || fallbackSrc)
    setError(false)
  }, [src, fallbackSrc])

  const handleImageError = () => {
    setError(true)
    setImageSrc(fallbackSrc)
  }

  // SVG'leri HTML olarak yükleyip render etme opsiyonu
  if (noSvgOptimization && typeof imageSrc === 'string' && imageSrc.endsWith('.svg') && !error) {
    return (
      <div 
        className={`svg-container ${rest.className || ''}`} 
        style={{
          width: typeof rest.width === 'number' ? `${rest.width}px` : rest.width,
          height: typeof rest.height === 'number' ? `${rest.height}px` : rest.height,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        aria-label={alt as string}
      />
    )
  }

  return (
    <>
      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-black/30 rounded">
          <AlertCircle className="w-1/3 h-1/3 text-gray-500" />
        </div>
      ) : (
        <Image 
          src={imageSrc} 
          alt={alt} 
          {...rest} 
          onError={handleImageError} 
          unoptimized={imageSrc.toString().endsWith('.svg') || rest.unoptimized}
        />
      )}
    </>
  )
}

