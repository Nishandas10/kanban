import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanBoard from './components/KanbanBoard';
import Header from './components/Header';
import './styles/App.css';
import { fetchData } from './api';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(() => {
    return localStorage.getItem('grouping') || 'status';
  });
  const [sorting, setSorting] = useState(() => {
    return localStorage.getItem('sorting') || 'priority';
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sorting', sorting);
  }, [grouping, sorting]);

  const handleGroupingChange = (value) => {
    setGrouping(value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTickets = [...tickets];
    const movedTicket = updatedTickets.find(ticket => ticket.id === draggableId);

    if (movedTicket) {
      // Update the ticket's status or user or priority based on the grouping
      switch (grouping) {
        case 'status':
          movedTicket.status = destination.droppableId;
          break;
        case 'user':
          movedTicket.userId = destination.droppableId;
          break;
        case 'priority':
          movedTicket.priority = parseInt(destination.droppableId);
          break;
        default:
          break;
      }

      setTickets(updatedTickets);
    }
  };

  return (
    <div className="app">
      <Header 
        grouping={grouping}
        sorting={sorting}
        onGroupingChange={handleGroupingChange}
        onSortingChange={handleSortingChange}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <KanbanBoard 
          tickets={tickets}
          users={users}
          grouping={grouping}
          sorting={sorting}
        />
      </DragDropContext>
    </div>
  );
};

export default App;


