import { useEffect, useState } from 'react'

function App() {
	const [date, setDate] = useState(Date.now() / 1000)
	const [sortType, setSortType] = useState('date') // priority
	const [sortOrder, setSortOrder] = useState('asc') // desc
	const [tasks, setTasks] = useState([])
	const activeTasks = sortTask(tasks.filter(task => !task.completed))
	const completedTasks = tasks.filter(task => task.completed)

	useEffect(() => {
		function changeDate() {
			const timer = setInterval(() => {
				setDate(Date.now() / 1000)
			}, 1000)
		}
		changeDate()
	}, [])

	function deleteTask(id) {
		setTasks(tasks.filter(task => task.id != id))
	}

	function addTask(task) {
		setTasks([...tasks, { ...task, completed: false, id: Date.now() }])
	}

	function completeTask(id) {
		setTasks(
			tasks.map(task => (task.id === id ? { ...task, completed: true } : task))
		)
	}

	function toogleSortOrder(type) {
		if (sortType === type) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortType(type)
			setSortOrder('asc')
		}
	}

	function sortTask(tasks) {
		return tasks.slice().sort((a, b) => {
			if (sortType === 'priority') {
				const priorityOrder = { High: 1, Medium: 2, Low: 3 }
				return sortOrder === 'asc'
					? priorityOrder[a.priority] - priorityOrder[b.priority]
					: priorityOrder[b.priority] - priorityOrder[a.priority]
			} else {
				return sortOrder === 'asc'
					? new Date(a.deadline) - new Date(b.deadline)
					: new Date(b.deadline) - new Date(a.deadline)
			}
		})
	}

	return (
		<div className='app'>
			<div className='task-container'>
				<TaskMake tasks={tasks} setTasks={setTasks} addTask={addTask} />
			</div>
			<div className='task-container'>
				<TaskList
					activeTasks={activeTasks}
					deleteTask={deleteTask}
					completeTask={completeTask}
					sortType={sortType}
					sortOrder={sortOrder}
					toogleSortOrder={toogleSortOrder}
					date={date}
				/>
			</div>
			<div className='completed-task-container'>
				<CompletedTasks
					completedTasks={completedTasks}
					deleteTask={deleteTask}
				/>
			</div>
			<footer>
				<Footer />
			</footer>
		</div>
	)
}

function TaskMake({ tasks, setTasks, addTask }) {
	const [isOpen, switchOpen] = useState(true)

	return (
		<>
			<h1>Task List with Priority</h1>
			<button
				className={`close-button ${isOpen && `open`}`}
				onClick={() => switchOpen(prev => !prev)}
			>
				+
			</button>
			{isOpen && <TaskForm addTask={addTask} />}
		</>
	)
}

function TaskForm({ addTask }) {
	const [title, setTitle] = useState('')
	const [priority, setPriority] = useState('Low')
	const [deadline, setDeadline] = useState('')

	function handleSubmit(e) {
		e.preventDefault()
		if (title.trim() && deadline) {
			{
				addTask({ title, priority, deadline })
				setTitle('')
				setPriority('Low')
				setDeadline('')
			}
		}
	}

	return (
		<>
			<form className='task-form' action={''} onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Task Title'
					required
					onChange={e => setTitle(e.target.value)}
					value={title}
				/>
				<select
					id=''
					required
					value={priority}
					onChange={e => setPriority(e.target.value)}
				>
					<option value='High'>High</option>
					<option value='Medium'>Medium</option>
					<option value='Low'>Low</option>
				</select>
				<input
					type='datetime-local'
					required
					onChange={e => setDeadline(e.target.value)}
					value={deadline}
				/>
				<button type='submit'>Add Task</button>
			</form>
		</>
	)
}

function TaskList({
	activeTasks,
	deleteTask,
	completeTask,
	toogleSortOrder,
	sortType,
	sortOrder,
	date,
}) {
	const [isOpen, switchOpen] = useState(true)

	return (
		<>
			<h1>Tasks:</h1>
			<button
				className={`close-button ${isOpen && `open`}`}
				onClick={() => switchOpen(prev => !prev)}
			>
				+
			</button>
			<div className='sort-controls'>
				<button
					className={`sort-button ${sortType === 'date' && 'active'}`}
					onClick={() => toogleSortOrder('date')}
				>
					By Date{' '}
					{sortType === 'date' && (sortOrder === 'asc' ? '\u2191' : '\u2193')}
				</button>
				<button
					className={`sort-button ${sortType === 'priority' && 'active'}`}
					onClick={() => toogleSortOrder('priority')}
				>
					By Priority{' '}
					{sortType === 'priority' &&
						(sortOrder === 'asc' ? '\u2191' : '\u2193')}
				</button>
			</div>
			<div className='task-list'>
				{activeTasks.map(task => (
					<ul>
						{isOpen && (
							<TaskItem
								task={task}
								deleteTask={deleteTask}
								completeTask={completeTask}
								isOverdue={
									date - Math.floor(new Date(task.deadline).getTime() / 1000) >
									0
										? true
										: false
								}
							/>
						)}
					</ul>
				))}
			</div>
		</>
	)
}

function CompletedTasks({ completedTasks, deleteTask }) {
	const [isOpen, switchOpen] = useState(true)

	return (
		<>
			<h1>Completed Tasks</h1>
			<button
				className={`close-button ${isOpen && `open`}`}
				onClick={() => switchOpen(prev => !prev)}
			>
				+
			</button>
			{completedTasks.map(task => (
				<ul className='completed-task-list'>
					{isOpen && <TaskItem task={task} deleteTask={deleteTask} />}
				</ul>
			))}
		</>
	)
}

function TaskItem({ task, deleteTask, completeTask, isOverdue }) {
	return (
		<li
			className={`task-item ${task.priority.toLowerCase()} ${
				isOverdue && 'overdue'
			}`}
		>
			<div className='task-info'>
				<div>
					{task.title} -{' '}
					<strong>{isOverdue ? 'overdue' : task.priority}</strong>
				</div>
				<div className='task-deadline'>Due: {task.deadline}</div>
			</div>
			<div className='task-buttons'>
				{!task.completed && (
					<button
						className='complete-button'
						onClick={() => completeTask(task.id)}
					>
						Complete
					</button>
				)}
				<button className='delete-button' onClick={() => deleteTask(task.id)}>
					Delete
				</button>
			</div>
		</li>
	)
}

function Footer() {
	return (
		<>
			<p>
				Technologies and React concepts used: React, JSX, Props, useState,
				component composition, conditional rendering, array methods (map,
				filter), event handling.
			</p>
		</>
	)
}

export default App
