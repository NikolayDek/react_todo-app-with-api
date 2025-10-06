import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo?: Todo;
  tempTodo?: Todo;
  onDeletedTodo?: (id: number) => Promise<void>;
  deletedTodosId?: number[];
  onToggle?: (todo: Todo) => void;
  toggledTodosId?: number[];
  onEditingTodo?: (todo: Todo, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodo,
  onDeletedTodo,
  deletedTodosId,
  onToggle,
  toggledTodosId,
  onEditingTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [titleQuery, setTitleQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = titleQuery.trim();

    if (!trimmedQuery.length) {
      setSubmitting(true);

      await onDeletedTodo!(editingTodo!.id).finally(() => {
        setEditingTodo(null);
        setSubmitting(false);
      });
    }

    if (trimmedQuery !== editingTodo?.title) {
      setSubmitting(true);

      if (!onEditingTodo) {
        return Promise.reject();
      }

      await onEditingTodo(editingTodo!, trimmedQuery).finally(() => {
        setEditingTodo(null);
        setSubmitting(false);
      });
    } else {
      setEditingTodo(null);
      setSubmitting(false);
    }
  };

  const handleBlur = async () => {
    const trimmedQuery = titleQuery.trim();

    if (!trimmedQuery.length) {
      setSubmitting(true);

      await onDeletedTodo!(editingTodo!.id).finally(() => {
        setEditingTodo(null);
        setSubmitting(false);
      });
    }

    if (trimmedQuery !== editingTodo?.title) {
      setSubmitting(true);

      if (!onEditingTodo) {
        return Promise.reject();
      }

      await onEditingTodo(editingTodo!, trimmedQuery).finally(() => {
        setEditingTodo(null);
        setSubmitting(false);
      });
    } else {
      setEditingTodo(null);
      setSubmitting(false);
    }
  };

  const handleEditingTodo = (selectedTodo: Todo) => {
    setTitleQuery(selectedTodo.title);

    if (!onEditingTodo) {
      return;
    }

    setEditingTodo(selectedTodo);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  useEffect(() => {
    if (editingTodo !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTodo]);

  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={classNames('todo', todo?.completed ? 'completed' : '')}
      >
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo?.completed}
            onChange={() => onToggle!(todo!)}
          />
        </label>

        {editingTodo !== null && editingTodo?.id === todo?.id ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleQuery}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            {/* eslint-enable jsx-a11y/label-has-associated-control */}
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleEditingTodo(todo!)}
            >
              {todo?.title || tempTodo?.title}
            </span>
            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeletedTodo!(todo!.id)}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': Boolean(
              tempTodo ||
                deletedTodosId?.includes(todo?.id ?? -1) ||
                toggledTodosId?.includes(todo?.id ?? -1) ||
                (submitting && editingTodo?.id === todo?.id),
            ),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
