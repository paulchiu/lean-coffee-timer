import { Howl } from 'howler'

export const beepSound = new Howl({
  src: ['/beep.mp3'],
})

export const alarmSound = new Howl({
  src: ['/alarm.mp3'],
})

// Format seconds to MM:SS
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
