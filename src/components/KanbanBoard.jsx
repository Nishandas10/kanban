import React, { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import '../styles/KanbanBoard.css';
import { Icons } from './Icons';

const KanbanBoard = ({ tickets, users, grouping, sorting }) => {
  const getPriorityLabel = (priority) => {
    const labels = {
      4: 'Urgent',
      3: 'High',
      2: 'Medium',
      1: 'Low',
      0: 'No priority'
    };
    return labels[priority];
  };

  const getColumnIcon = (columnName) => {
    // Status icons
    if (columnName === 'Todo') return <Icons.Todo />;
    if (columnName === 'In progress') return <Icons.InProgress />;
    if (columnName === 'Backlog') return <Icons.Backlog />;
    if (columnName === 'Done') return <Icons.Done />;

    // Priority icons
    if (columnName === 'No priority') return <Icons.NoPriority />;
    if (columnName === 'Urgent') return <Icons.Urgent />;
    if (columnName === 'High') return <Icons.High />;
    if (columnName === 'Medium') return <Icons.Medium />;
    if (columnName === 'Low') return <Icons.Low />;

    // User icon/avatar
    const user = users.find(u => u.name === columnName);
    if (user) {
      return (
        <div className="user-column-avatar">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32`}
            alt={user.name}
          />
          <span className={`status-indicator ${user.available ? 'available' : 'unavailable'}`}></span>
        </div>
      );
    }

    if (columnName === 'Unassigned') return <Icons.User />;
    
    return <Icons.Todo />; // Default icon
  };

  const groupedTickets = useMemo(() => {
    let groups = {};

    switch (grouping) {
      case 'status':
        tickets.forEach(ticket => {
          if (!groups[ticket.status]) groups[ticket.status] = [];
          groups[ticket.status].push(ticket);
        });
        break;

      case 'user':
        tickets.forEach(ticket => {
          const user = users.find(u => u.id === ticket.userId);
          const userName = user ? user.name : 'Unassigned';
          if (!groups[userName]) groups[userName] = [];
          groups[userName].push(ticket);
        });
        break;

      case 'priority':
        tickets.forEach(ticket => {
          const priorityLabel = getPriorityLabel(ticket.priority);
          if (!groups[priorityLabel]) groups[priorityLabel] = [];
          groups[priorityLabel].push(ticket);
        });
        break;

      default:
        break;
    }

    // Sort tickets within each group
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        if (sorting === 'priority') {
          return b.priority - a.priority;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    });

    return groups;
  }, [tickets, users, grouping, sorting]);

  return (
    <div className="kanban-board">
      {Object.entries(groupedTickets).map(([group, groupTickets]) => (
        <Droppable key={group} droppableId={group}>
          {(provided) => (
            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="column-header">
                <h2>
                  <span className="column-icon">{getColumnIcon(group)}</span>
                  {group}
                </h2>
                <span className="ticket-count">{groupTickets.length}</span>
              </div>
              <div className="cards">
                {groupTickets.map((ticket, index) => (
                  <Card 
                    key={ticket.id}
                    ticket={ticket}
                    user={users.find(u => u.id === ticket.userId)}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default KanbanBoard;

