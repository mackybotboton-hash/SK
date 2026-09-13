import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useSchedule from '../hooks/useSchedule';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import EventFormModal from '../components/schedule/EventFormModal';
import { MdAdd, MdChevronLeft, MdChevronRight, MdEvent } from 'react-icons/md';

export default function SchedulePage() {
  const { activities, loading, saveActivity, deleteActivity } = useSchedule();
  const { hasPermission } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    if (!hasPermission('manage:schedules')) return;
    const selectedDate = new Date(year, month, day, 9, 0); // Default to 9 AM
    setEditingEvent({ start_time: selectedDate, end_time: new Date(year, month, day, 10, 0) });
    setIsModalOpen(true);
  };

  const handleEventClick = (e, activity) => {
    e.stopPropagation();
    if (!hasPermission('manage:schedules')) return;
    setEditingEvent(activity);
    setIsModalOpen(true);
  };

  const handleSave = async (activityModel) => {
    const success = await saveActivity(activityModel);
    if (success) setIsModalOpen(false);
  };

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Headers
    const headers = weekDays.map(day => (
      <div key={day} style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
        {day}
      </div>
    ));

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '1rem', background: 'var(--bg-body)', opacity: 0.5, borderRight: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }} />);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();
      
      const dayActivities = activities.filter(a => {
        const d = new Date(a.start_time);
        return d.getDate() === i && d.getMonth() === month && d.getFullYear() === year;
      });

      days.push(
        <div 
          key={i} 
          onClick={() => handleDayClick(i)}
          style={{ 
            padding: '0.5rem', 
            minHeight: '120px', 
            borderRight: '1px solid var(--border-default)', 
            borderBottom: '1px solid var(--border-default)',
            background: isToday ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'transparent',
            cursor: hasPermission('manage:schedules') ? 'pointer' : 'default',
            position: 'relative'
          }}
          className="hover-lift"
        >
          <div style={{ 
            width: '24px', height: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            borderRadius: '50%', 
            background: isToday ? 'var(--primary)' : 'transparent',
            color: isToday ? 'white' : 'var(--text-primary)',
            fontWeight: isToday ? 600 : 400,
            marginBottom: '0.5rem'
          }}>
            {i}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {dayActivities.map(act => (
              <div 
                key={act.id} 
                onClick={(e) => handleEventClick(e, act)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: act.type === 'Meeting' ? 'var(--info)' : act.type === 'Deadline' ? 'var(--danger)' : 'var(--primary)',
                  color: 'white',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={act.title}
              >
                {new Date(act.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {act.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--border-default)', borderLeft: '1px solid var(--border-default)' }}>
        {headers}
        {days}
      </div>
    );
  };

  return (
    <div className="page-enter">
      <PageHeader title="Schedule & Activities" description="Manage council meetings, project timelines, and deadlines">
        {hasPermission('manage:schedules') && (
          <button className="btn btn-primary" onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center' }}>
            <MdAdd size={20} style={{ marginRight: '0.25rem' }} /> Add Event
          </button>
        )}
      </PageHeader>

      <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdEvent color="var(--primary)" /> {monthNames[month]} {year}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={prevMonth} style={{ padding: '0.5rem' }}><MdChevronLeft size={24} /></button>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date())}>Today</button>
            <button className="btn btn-secondary" onClick={nextMonth} style={{ padding: '0.5rem' }}><MdChevronRight size={24} /></button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '800px' }}>
            {renderCalendar()}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent?.id ? 'Edit Event' : 'Add Event'}>
        <EventFormModal 
          initialData={editingEvent?.id ? editingEvent.toJSON() : editingEvent} 
          onSave={handleSave} 
          onCancel={() => setIsModalOpen(false)} 
          loading={loading} 
        />
        {editingEvent?.id && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-default)' }}>
            <button 
              className="btn btn-secondary" 
              style={{ color: 'var(--danger)', width: '100%', borderColor: 'var(--danger)' }}
              onClick={async () => {
                if (window.confirm(`Delete "${editingEvent.title}"?`)) {
                  await deleteActivity(editingEvent.id, editingEvent.title);
                  setIsModalOpen(false);
                }
              }}
            >
              Delete Event
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
