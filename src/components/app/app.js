import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 100;
  createTodoItem = (label) => {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    };
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);

      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];

      return {
        todoData: newArray
      };
    });
  };

  addItem = (text) => {
    const newItem = this.createTodoItem(text);

    this.setState(({ todoData }) => {
      return {
        todoData: [...todoData, newItem]
      };
    });
  };

  toggleProperty = (array, id, promName) => {
    const idx = array.findIndex((el) => el.id === id);
    const oldItem = array[idx];
    const newItem = { ...oldItem, [promName]: !oldItem[promName] };

    return [...array.slice(0, idx), newItem, ...array.slice(idx + 1)];
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      };
    });
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      };
    });
  };

  onSearchChange = (term) => {
    this.setState({ term });
  };

  search = (items, label) => {
    if (label.length === 0) {
      return items;
    }
    return items.filter(
      (el) => el.label.toUpperCase().indexOf(label.toUpperCase()) > -1
    );
  };

  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  filter = (items, filter) => {
    switch (filter) {
      case 'active':
        return items.filter((el) => !el.done);
      case 'done':
        return items.filter((el) => el.done);
      case 'all':
      default:
        return items;
    }
  };

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    term: '',
    filter: 'all' // all, active. done
  };

  render() {
    const { todoData, filter, term } = this.state;
    const doneCount = todoData.filter((el) => el.done === true).length;
    const todoCount = todoData.length - doneCount;

    const visibleItems = this.filter(this.search(todoData, term), filter);

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange}
          />
        </div>

        <TodoList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />

        <ItemAddForm onItemAdded={this.addItem} />
      </div>
    );
  }
}
