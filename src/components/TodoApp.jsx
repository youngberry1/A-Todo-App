import { useState, useRef } from 'react';
import './TodoApp.css';
import { useEffect } from 'react';

export default function TodoApp() {
   const inputRef = useRef(null);
   const [tasks, setTasks] = useState([]);
   const [taskText, setTaskText] = useState('');
   const [inputError, setInputError] = useState(false);

   // ✅ Load saved tasks from localStorage on component mount
   useEffect(() => {
      const saved = localStorage.getItem('tasks');
      if (saved) {
         setTasks(JSON.parse(saved));
      }
   }, []);

   // ✅ Save tasks to localStorage whenever tasks change
   useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
   }, [tasks]);

   const handleChange = (e) => setTaskText(e.target.value);

   const handleAddTask = () => {
      if (taskText.trim() === '') {
         inputRef.current.title = 'Please enter a task';
         inputRef.current.classList.add('input-warning');
         setInputError(true);
         inputRef.current.focus();
         return;
      }

      setInputError(true);
      inputRef.current.title = ''; // clear title if previously set
      inputRef.current.classList.remove('input-warning');

      const newTask = {
         id: Date.now(),
         text: taskText.trim(),
      };
      setTasks((prev) => [...prev, newTask]);
      setTaskText('');
      inputRef.current.focus();
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleAddTask();
   };

   const removeTask = (id) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
   };

   return (
      <div className='todo-container'>
         <input
            ref={inputRef}
            placeholder='Enter a task...'
            value={taskText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={inputError ? 'input-error' : ''}
         />
         <button onClick={handleAddTask}>Add Task</button>

         {inputError && (
            <p className='error-text'>Please enter a task before adding.</p>
         )}

         <ul>
            {tasks.map((task) => (
               <li key={task.id}>
                  {task.text}
                  <button
                     className='remove-btn'
                     onClick={() => removeTask(task.id)}
                  >
                     ❌
                  </button>
               </li>
            ))}
         </ul>

         <p className='total-count'>Total Tasks: {tasks.length}</p>
      </div>
   );
}
