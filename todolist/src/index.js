import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { nanoid } from "nanoid";
import "./index.css";

function Header(props) {
  const tasksNoun = props.tasks.length > 1 ? "tâches restantes" : "tâche restante";
  const tasksChecked = props.tasks.filter((task) => task.isChecked === false);
  const headingText = `${tasksChecked.length} ${tasksNoun} sur ${props.tasks.length}`;
  return(
    <h2 id="list-heading">{headingText}</h2>
  );
}

function Footer(props) {
  const [search, setSearch] = useState("");

  function handleChange(e) {
    setSearch(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(search);
    if (search.length >= 3) {
      props.searchTasks(search);
    }
  }

  return (
    <div className="btn-group">
    <Form addTask={props.addTask} />
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper"></h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        placeholder="Chercher une tâche"
        value={search}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary">
        Search
      </button>
      <button
        type="button"
        className="btn btn__primary"
        onClick={() => (props.resetSearch(), setSearch(""))}
      >
        Reset
      </button>
    </form>
    </div>
  );
}



function Form(props) {
  const [title, setTitle] = useState("");

  function handleChange(e) {
    setTitle(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (title.length > 0) {
      props.addTask(title);
    }
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper"></h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        placeholder="Ajouter une tâche"
        value={title}
        onChange={handleChange}
      />
      <button type="submit" id="add-task-button" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

function Tache(props) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.isChecked}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.title}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.title}</span>
        </button>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn__filter"
          onClick={() => props.raiseTask(props.id)}
        >
          Monter tâche <span className="visually-hidden">{props.title}</span>
        </button>
        <button
          type="button"
          className="btn btn__filter"
          onClick={() => props.lowerTask(props.id)}
        >
          Descendre tâche <span className="visually-hidden">{props.title}</span>
        </button>
      </div>
    </li>
  );
}

function Tab(props) {
  const [tasks, setTasks] = useState(props.tasks);

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, isChecked: !task.isChecked };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem("DATA", JSON.stringify(updatedTasks));
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    localStorage.setItem("DATA", JSON.stringify(remainingTasks));
  }

  function raiseTask(id) {
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].id === id && index > 0) {
        console.log(tasks[index]);
        let updatedTasks = [...tasks];
        updatedTasks[index - 1] = tasks[index];
        updatedTasks[index] = tasks[index - 1];
        console.log(updatedTasks[index]);
        setTasks(updatedTasks);
        localStorage.setItem("DATA", JSON.stringify(updatedTasks));
        return;
      }
    }
  }

  function lowerTask(id) {
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].id === id && index < tasks.length - 1) {
        console.log(tasks[index]);
        let updatedTasks = [...tasks];
        updatedTasks[index + 1] = tasks[index];
        updatedTasks[index] = tasks[index + 1];
        console.log(updatedTasks[index]);
        setTasks(updatedTasks);
        localStorage.setItem("DATA", JSON.stringify(updatedTasks));
        return;
      }
    }
  }

  function addTask(title) {
    const newTask = { id: `todo-${nanoid()}`, title, isChecked: false };
    setTasks([...tasks, newTask]);
    localStorage.setItem("DATA", JSON.stringify([...tasks, newTask]));
  }

  function searchTasks(searchTerm) {
    const allTasks = JSON.parse(localStorage.getItem("DATA"));
    const searchedTasks = allTasks.filter(
      (task) => task.title.includes(searchTerm) === true
    );
    setTasks(searchedTasks);

    const button = document.getElementById("add-task-button");
    button.disabled = true;
  }

  function resetSearch() {
    setTasks(JSON.parse(localStorage.getItem("DATA")));
    const button = document.getElementById("add-task-button");
    button.disabled = false;
  }

  const taskList = tasks.map((task) => (
    <Tache
      id={task.id}
      title={task.title}
      isChecked={task.isChecked}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      raiseTask={raiseTask}
      lowerTask={lowerTask}
    />
  ));
  return (
    <div className="todoapp stack-large">
      <h1>Le TODO LIST de Ethan !</h1>
      <Header tasks={tasks} />
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
      <Footer searchTasks={searchTasks} resetSearch={resetSearch} addTask={addTask}/>
    </div>
  );
}

if (localStorage.getItem("DATA") === null) {
  const DATA = [
    { id: "todo-1", title: "1.Idée", isChecked: true },
    { id: "todo-2", title: "2.Marché", isChecked: true },
    { id: "todo-3", title: "3.Wireframe", isChecked: true },
    { id: "todo-4", title: "4.Design", isChecked: true },
    { id: "todo-5", title: "5.Landingpage", isChecked: true },
    { id: "todo-6", title: "6.Développement", isChecked: false },
    { id: "todo-7", title: "7.Publish", isChecked: false },
    { id: "todo-8", title: "8.Pub", isChecked: false },
    { id: "todo-9", title: "9.Feedback", isChecked: false },
  ];
  localStorage.setItem("DATA", JSON.stringify(DATA));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Tab tasks={JSON.parse(localStorage.getItem("DATA"))} />);
