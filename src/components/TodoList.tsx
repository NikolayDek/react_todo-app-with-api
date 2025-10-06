import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDeletedTodo: (id: number) => Promise<void>;
  deletedTodosId: number[];
  completedTodos: Todo[];
  onToggle: (todo: Todo) => void;
  toggleTodosId: number[];
  onEditingTodo: (todo: Todo, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDeletedTodo,
  deletedTodosId,
  onToggle,
  toggleTodosId,
  onEditingTodo,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeletedTodo={onDeletedTodo}
          deletedTodosId={deletedTodosId}
          onToggle={onToggle}
          toggledTodosId={toggleTodosId}
          onEditingTodo={onEditingTodo}
        />
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </>
  );
};
