import { v4 as uuid } from 'uuid'

import { ITodo } from '../types'

interface TodoState {
  todos: ITodo[]
}

export type Action =
  | { type: 'CREATE_TODO'; payload: Omit<ITodo, 'id'> }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'MOVE_TODO'; payload: { id: string; newDate: number } }

export const initialState: TodoState = {
  todos: [],
}

export const reducer = (state: TodoState, action: Action): TodoState => {
  switch (action.type) {
    case 'CREATE_TODO':
      return { todos: [...state.todos, { ...action.payload, id: uuid() }] }
    case 'DELETE_TODO':
      return { todos: state.todos.filter((todo) => todo.id !== action.payload) }
    case 'MOVE_TODO':
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, date: action.payload.newDate } : todo,
        ),
      }
    default:
      return state
  }
}
