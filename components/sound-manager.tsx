"use client"

import { useEffect, useRef } from "react"

interface SoundManagerProps {
  enabled: boolean
}

export function SoundManager({ enabled }: SoundManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [enabled])

  const playSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (!enabled || !audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  // Expose sound functions
  useEffect(() => {
    ;(window as any).playTradeSound = () =>
      (playSound(800, 0.2)(window as any).playSuccessSound = () =>
        (playSound(600, 0.3)(window as any).playErrorSound = () =>
          (playSound(300, 0.5)(window as any).playNotificationSound = () => playSound(500, 0.2))))
  }, [enabled])

  return null
}
