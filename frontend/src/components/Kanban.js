import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Layers, Plus, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import './Kanban.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Kanban = () => {
    // Columns aligned with Backend ENUM: Pending, In Progress, Completed
    const [columns, setColumns] = useState({
        'pending': {
            id: 'pending',
            title: 'Pending',
            taskIds: [],
            color: '#f2994a'
        },
        'in-progress': {
            id: 'in-progress',
            title: 'In Progress',
            taskIds: [],
            color: '#667eea'
        },
        'completed': {
            id: 'completed',
            title: 'Completed',
            taskIds: [],
            color: '#38ef7d'
        },
    });

    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const columnOrder = ['pending', 'in-progress', 'completed'];

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/tasks`);
            const fetchedTasks = res.data;

            const newTasks = {};
            const newColumns = {
                'pending': { ...columns['pending'], taskIds: [] },
                'in-progress': { ...columns['in-progress'], taskIds: [] },
                'completed': { ...columns['completed'], taskIds: [] },
            };

            fetchedTasks.forEach(task => {
                const taskId = task.id.toString(); // Ensure string ID for dnd
                newTasks[taskId] = {
                    id: taskId,
                    content: task.title,
                    priority: task.priority || 'Medium',
                    assignee: task.assignee || 'Unassigned',
                    status: task.status
                };

                // Map backend status to column ID
                let columnId = 'pending';
                if (task.status === 'In Progress') columnId = 'in-progress';
                else if (task.status === 'Completed') columnId = 'completed';

                newColumns[columnId].taskIds.push(taskId);
            });

            setTasks(newTasks);
            setColumns(newColumns);
        } catch (error) {
            console.error('Error fetching tasks for Kanban:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            });
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        setColumns({
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        });

        // Update Backend Status
        let newStatus = 'Pending';
        if (destination.droppableId === 'in-progress') newStatus = 'In Progress';
        if (destination.droppableId === 'completed') newStatus = 'Completed';

        try {
            // We need the full task object to update, but put only usually needs changed fields if backend supports it
            // Assuming we need to send at least required fields or just status. 
            // Our backend Update looks for req.body. Let's send status.
            // Wait, previous update code sent {...task, status: ...}. 
            // We only have limited data in `tasks` state here.

            // Re-fetch to be safe or just send status?
            // Let's optimistic update and if fail revert? For complexity, just send status update.
            // Backend `Task.update(req.body` replaces fields. If we only send status, other fields might be lost if using replace?
            // Sequelize `update` updates only provided fields. So we are safe to send just status.

            await axios.put(`${API_URL}/tasks/${draggableId}`, { status: newStatus });

        } catch (error) {
            console.error('Error updating task status:', error);
            // Ideally revert state here
            fetchTasks();
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#ff758c';
            case 'MEDIUM': // Backend uses uppercase sometimes?
            case 'Medium': return '#f2994a';
            case 'Low': return '#38ef7d';
            default: return '#ccc';
        }
    };

    return (
        <div className="kanban-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Layers size={32} />
                        Kanban Board
                    </h1>
                    <p>Drag and drop tasks to manage workflow</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading board...</div>
            ) : (
                <div className="kanban-board">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {columnOrder.map(columnId => {
                            const column = columns[columnId];
                            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                            return (
                                <div key={column.id} className="kanban-column">
                                    <div className="column-header" style={{ borderTop: `4px solid ${column.color}` }}>
                                        <h3>{column.title}</h3>
                                        <span className="task-count">{columnTasks.length}</span>
                                        <button className="column-options">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {columnTasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className={`kanban-task ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <div className="task-tags">
                                                                    <span className="task-tag" style={{ background: getPriorityColor(task.priority) }}>
                                                                        {task.priority || 'Medium'}
                                                                    </span>
                                                                </div>
                                                                <p className="task-content">{task.content}</p>
                                                                <div className="task-footer">
                                                                    <div className="assignee-avatar">
                                                                        {task.assignee ? task.assignee.charAt(0) : '?'}
                                                                    </div>
                                                                    <span className="task-id">#{task.id}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </DragDropContext>
                </div>
            )}
        </div>
    );
};

export default Kanban;
