import { Howl } from 'howler'

export const beepSound = new Howl({
  src: ['/beep.mp3'],
})

export const alarmSound = new Howl({
  src: ['/alarm.mp3'],
})

// Format seconds to MM:SS
export const formatTime = (
  time: number,
  opts?: { allowNegative?: boolean }
): string => {
  const allowNegative = opts?.allowNegative ?? false

  if (time < 0 && !allowNegative) {
    return '00:00'
  }

  const negative = time < 0
  const absTime = Math.abs(time)
  const minutes = Math.floor(absTime / 60)
  const seconds = absTime % 60
  const base = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
  return negative ? `-${base}` : base
}
