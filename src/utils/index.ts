import { CreateDate, CreateMonth, IDay, IMonth } from '../types'

const LOCALE = 'en-US'

export const createDate = ({ date }: CreateDate): IDay => {
  const dayNumber = date.getDate()
  const day = date.toLocaleDateString(LOCALE, { weekday: 'long' })
  const dayNumberInWeek = date.getDay() + 1
  const dayShort = date.toLocaleDateString(LOCALE, { weekday: 'short' })
  const year = date.getFullYear()
  const month = date.toLocaleDateString(LOCALE, { month: 'long' })
  const monthNumber = date.getMonth() + 1
  const monthIndex = date.getMonth()
  const timestamp = date.getTime()
  const week = getWeekNumber(date)
  const isFirstDay = dayNumber === 1
  const isLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === dayNumber

  return {
    date,
    dayNumber,
    day,
    dayNumberInWeek,
    dayShort,
    year,
    month,
    monthNumber,
    monthIndex,
    timestamp,
    week,
    isFirstDay,
    isLastDay,
  }
}

export const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000

  return Math.ceil((pastDaysYear + firstDayOfYear.getDay() + 1) / 7)
}

export const createMonth = ({ date }: CreateMonth): IMonth => {
  const d = createDate({ date })
  const { month: monthName, year, monthNumber, monthIndex } = d

  const createMonthDays = () => {
    const days = []
    for (let i = 0; i <= getMonthNumberOfDays(monthIndex, year) - 1; i += 1) {
      days[i] = createDate({ date: new Date(year, monthIndex, i + 1) })
    }

    return days
  }

  return {
    monthName,
    monthIndex,
    monthNumber,
    year,
    createMonthDays,
  }
}

export const getMonthNumberOfDays = (monthIndex: number, yearNumber: number = new Date().getFullYear()) =>
  new Date(yearNumber, monthIndex + 1, 0).getDate()

export const getMonthsNames = () => {
  const monthsNames: {
    month: ReturnType<typeof createDate>['month']
    monthIndex: ReturnType<typeof createDate>['monthIndex']
    date: ReturnType<typeof createDate>['date']
  }[] = Array.from({ length: 12 })

  const d = new Date()

  monthsNames.forEach((_, i) => {
    const { month, monthIndex, date } = createDate({
      date: new Date(d.getFullYear(), d.getMonth() + i, 1),
    })

    monthsNames[monthIndex] = { month, monthIndex, date }
  })

  return monthsNames
}

export const getWeekDaysNames = () => {
  const weekDaysNames: {
    day: ReturnType<typeof createDate>['day']
    dayShort: ReturnType<typeof createDate>['dayShort']
  }[] = Array.from({ length: 7 })

  const date = new Date()

  weekDaysNames.forEach((_, i) => {
    const { day, dayNumberInWeek, dayShort } = createDate({
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + i),
    })

    weekDaysNames[dayNumberInWeek - 1] = { day, dayShort }
  })

  return [...weekDaysNames.slice(0), ...weekDaysNames.slice(0, 0)]
}

export const checkIsToday = (date: Date) => {
  const today = new Date()

  return checkDateIsEqual(today, date)
}

export const checkDateIsEqual = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear()
