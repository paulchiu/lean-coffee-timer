import { Howl } from 'howler'

// Sound effect for when timer ends
export const beepSound = new Howl({
  src: ['/beep.mp3'],
})

// Format seconds to MM:SS
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
