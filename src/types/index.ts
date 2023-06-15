export interface CreateDate {
  date: Date
}

export interface IDay {
  date: Date
  dayNumber: number
  day: string
  dayNumberInWeek: number
  dayShort: string
  year: number
  month: string
  monthNumber: number
  monthIndex: number
  timestamp: number
  week: number
  isFirstDay: boolean
  isLastDay: boolean
}

export interface CreateMonth {
  date: Date
}

export interface IMonth {
  monthName: string
  monthIndex: number
  monthNumber: number
  year: number
  createMonthDays: () => IDay[]
}

export interface ITodo {
  description: string
  priorities: string[]
  date: number
  id: string
}

export interface IHolidays {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  counties: string[]
  launchYear: number
  types: string[]
}
