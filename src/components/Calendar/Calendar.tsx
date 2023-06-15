import React, { useCallback, useReducer, useState, MouseEvent, useEffect, DragEvent } from 'react'
import styled from 'styled-components'

import { useCalendar, reducer, initialState } from '../../hooks'
import { checkDateIsEqual, checkIsToday } from '../../utils'
import { ColorsPriority } from '../../enums'
import { IHolidays } from '../../types'

const URL = 'https://date.nager.at/api/v3/PublicHolidays'
const COUNTRY_CODE = 'UA'

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
`
const CalendarHeaderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-weight: 600;
`
const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff61de;
  border: 1px solid gray;
  padding: 8px;
  margin: 8px;
  min-width: 32px;
  cursor: pointer;
  border-radius: 2px;
  &:hover {
    background-color: #bdbdbd;
  }
`
const CalendarBody = styled.div`
  border-radius: 5px;
  padding: 8px;
`
const CalendarWeekNames = styled.div`
  height: 20px;
  font-weight: 600;
  text-align: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px 1px;
`
const CalendarDays = styled.div`
  height: 20px;
  font-weight: 600;
  text-align: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 2px 2px;
`
const CalendarDayContainer = styled.div<{
  currentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isHoliday: boolean
}>`
  position: relative;
  height: 124px;
  border: 2px solid ${({ isToday, isSelected }) => (isSelected ? '#7979ff' : isToday ? '#5252ff' : '#bdbdbd')};
  border-radius: 4px;
  cursor: pointer;
  text-align: start;
  padding: 8px;
  font-size: 12px;
  background-color: ${({ isToday, currentMonth, isHoliday }) =>
    isHoliday ? '#ff8de7' : currentMonth ? '#d5d5ff' : isToday ? '#bdbdbd' : '#e9e9e9'};
  &:hover {
    background-color: ${({ isToday, currentMonth, isHoliday }) =>
      isHoliday ? '#ff61de' : currentMonth ? '#aebcfd' : isToday ? '#979701' : '#d9d9d9'};
  }
`
const TodoCount = styled.span`
  font-size: 12px;
  color: gray;
`
const TodoItemPriority = styled.span<{ color: string }>`
  display: inline-block;
  width: 30px;
  height: 6px;
  border-radius: 4px;
  margin: 2px;
  background-color: ${({ color }) => color};
`
const TodoItem = styled.div`
  position: relative;
  align-items: center;
  padding: 4px;
  background-color: white;
  border-radius: 4px;
  margin: 2px;
`
const TodoItemClose = styled.div`
  position: absolute;
  top: 0;
  right: 4%;
  cursor: pointer;
`
const AddTodo = styled.div`
  font-size: 10px;
  position: absolute;
  bottom: 4%;
  right: 4%;
  color: blue;
`
const Modal = styled.form`
  position: absolute;
  z-index: 99999999;
  background-color: white;
  border-radius: 4px;
  padding: 16px;
  border: 2px solid;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
`
const LabelCheckBox = styled.label`
  font-size: 12px;
`
const ModalButton = styled.button<{ color: string }>`
  margin: 8px;
  padding: 8px;
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 6px;
  &:hover {
    background-color: ${({ color }) => `${color}77`};
  }
`
const ModalInput = styled.input`
  margin: 8px;
  padding: 8px;
  border: 2px;
`
const DateSpan = styled.label`
  font-size: 14px;
`
const HolidayName = styled.span`
  float: right;
  font-size: 14px;
`

export const Calendar = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    state: { calendarDays, selectedMonth, selectedYear, weekDaysNames },
    functions: { onClickArrow },
  } = useCalendar()

  const [holidays, setHolidays] = useState<IHolidays[]>([])
  const [selectedDate, setSelectedDay] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [priorities, setPriorities] = useState<string[]>([])
  const [droppingTodo, setDroppingTodo] = useState<string>('')

  useEffect(() => {
    try {
      fetch(`${URL}/${selectedYear}/${COUNTRY_CODE}`)
        .then((res) => res.json())
        .then((res) => setHolidays(res))
    } catch (error) {
      console.log(error)
    }
  }, [selectedYear])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    const { id } = event.currentTarget.dataset
    id && setDroppingTodo(id)
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const { time } = event.currentTarget.dataset
      time && dispatch({ type: 'MOVE_TODO', payload: { id: droppingTodo, newDate: +time } })
      setDroppingTodo('')
    },
    [droppingTodo],
  )

  const handleOpenModal = useCallback(() => {
    setOpen(true)
  }, [])
  const handleCloseModal = useCallback(() => {
    setOpen(false)
  }, [])

  const handleSubmit = useCallback(() => {
    dispatch({ type: 'CREATE_TODO', payload: { description, priorities, date: selectedDate.getTime() } })
    handleCloseModal()
    setDescription('')
    setPriorities([])
  }, [description, handleCloseModal, priorities, selectedDate])

  const handleDelete = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const { id } = event.currentTarget.dataset
    id && dispatch({ type: 'DELETE_TODO', payload: id })
  }, [])

  const handlePrevMonth = useCallback(() => {
    onClickArrow('left')
  }, [onClickArrow])

  const handleNextMonth = useCallback(() => {
    onClickArrow('right')
  }, [onClickArrow])

  return (
    <>
      <CalendarHeader>
        <CalendarHeaderItem>
          <Button type={'button'} onClick={handleNextMonth}>
            +
          </Button>
          <Button type={'button'} onClick={handlePrevMonth}>
            -
          </Button>
        </CalendarHeaderItem>
        <CalendarHeaderItem>{`${selectedMonth.monthName} ${selectedYear}`}</CalendarHeaderItem>
      </CalendarHeader>
      <CalendarBody>
        <>
          <CalendarWeekNames>
            {weekDaysNames.map((week, index) => (
              <div key={index}>{week.dayShort}</div>
            ))}
          </CalendarWeekNames>
          <CalendarDays>
            {calendarDays.map((day, index) => {
              const getTodosInDay = state.todos.filter((todo) => checkDateIsEqual(new Date(todo.date), day.date))
              const holidayToday = holidays.filter(
                (holiday) =>
                  holiday.date ===
                  `${day.year}-${day.monthNumber < 10 ? '0' + day.monthNumber : day.monthNumber}-${
                    day.dayNumber < 10 ? '0' + day.dayNumber : day.dayNumber
                  }`,
              )[0]
              return (
                <CalendarDayContainer
                  key={index}
                  currentMonth={day.monthIndex === selectedMonth.monthIndex}
                  isToday={checkIsToday(day.date)}
                  isSelected={selectedDate === day.date}
                  onClick={() => setSelectedDay(day.date)}
                  isHoliday={!!holidayToday}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  data-time={day.timestamp}
                >
                  <DateSpan>{`${day.isFirstDay || day.isLastDay ? day.month : ''} ${day.dayNumber} `}</DateSpan>
                  {!!getTodosInDay?.length && <TodoCount>{`${getTodosInDay.length} card`}</TodoCount>}
                  {holidayToday && <HolidayName>{holidayToday.localName}</HolidayName>}
                  <>
                    {getTodosInDay?.map(({ description, priorities, id }, index) => (
                      <TodoItem key={index} draggable={true} onDragLeave={onDragLeave} data-id={id}>
                        <TodoItemClose onClick={handleDelete} data-id={id}>
                          x
                        </TodoItemClose>
                        {priorities.map((priority) => (
                          <TodoItemPriority key={priority} color={priority} />
                        ))}
                        <div>{description}</div>
                      </TodoItem>
                    ))}
                    <AddTodo onClick={handleOpenModal}>Add</AddTodo>
                  </>
                </CalendarDayContainer>
              )
            })}
            {open && (
              <Modal onSubmit={(e) => e.preventDefault()}>
                <label>Description:</label>
                <br />
                <ModalInput
                  type={'text'}
                  value={description}
                  placeholder="Description"
                  maxLength={50}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <label>Priority:</label>
                <br />
                {Object.entries(ColorsPriority).map(([name, color]) => (
                  <div key={color}>
                    <LabelCheckBox>{name}</LabelCheckBox>{' '}
                    <input
                      type="checkbox"
                      value={color}
                      onChange={(e) => setPriorities([...priorities, e.target.value])}
                    />
                  </div>
                ))}
                <br />
                <ModalButton type={'button'} onClick={handleSubmit} color={'#2196f3'}>
                  Submit
                </ModalButton>
                <ModalButton onClick={handleCloseModal} color={'#f44336'}>
                  Cancel
                </ModalButton>
              </Modal>
            )}
          </CalendarDays>
        </>
      </CalendarBody>
    </>
  )
}
