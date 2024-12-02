import React, { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import '../styles/KanbanBoard.css';

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
                <h2>{group}</h2>
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

