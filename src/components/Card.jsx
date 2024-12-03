import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Icons } from './Icons';
import '../styles/Card.css';

const Card = ({ ticket, user, index }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4: return '🔴'; // Urgent
      case 3: return '🟠'; // High
      case 2: return '🟡'; // Medium
      case 1: return '🔵'; // Low
      case 0: return '⚪'; // No priority
      default: return '⚪';
    }
  };

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-header">
            <div className="header-left">
              <button className="menu-button">
                <Icons.Menu />
              </button>
              <span className="ticket-id">{ticket.id}</span>
            </div>
            {user && (
              <div className="user-avatar" title={user.name}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                />
                <span className={`status-indicator ${user.available ? 'available' : 'unavailable'}`}></span>
              </div>
            )}
          </div>
          <div className="card-title">{ticket.title}</div>
          <div className="card-footer">
            <div className="priority-tag">
              <span className="priority-icon">{getPriorityIcon(ticket.priority)}</span>
            </div>
            {ticket.tag.map((tag, index) => (
              <div key={index} className="tag">
                <span className="tag-icon">⚪</span>
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
