import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentCalendar = ({ bills, onSelectDate, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthData = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days?.push(new Date(current));
      current?.setDate(current?.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  const getBillsForDate = (date) => {
    const dateString = date?.toISOString()?.split('T')?.[0];
    return bills?.filter(bill => bill?.dueDate === dateString);
  };

  const getTotalAmountForDate = (date) => {
    const dateBills = getBillsForDate(date);
    return dateBills?.reduce((sum, bill) => sum + bill?.amount, 0);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(newDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date?.getMonth() === currentDate?.getMonth();
  };

  const { days } = getMonthData(currentDate);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Payment Calendar</h2>
              <p className="text-sm text-muted-foreground">
                {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="px-4"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Paid</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Due Soon</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Overdue</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Scheduled</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames?.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days?.map((day, index) => {
            const dayBills = getBillsForDate(day);
            const totalAmount = getTotalAmountForDate(day);
            const hasOverdue = dayBills?.some(bill => bill?.status === 'overdue');
            const hasPaid = dayBills?.some(bill => bill?.status === 'paid');
            const hasScheduled = dayBills?.some(bill => bill?.status === 'scheduled');
            const hasPending = dayBills?.some(bill => bill?.status === 'pending');

            return (
              <button
                key={index}
                onClick={() => onSelectDate && onSelectDate(day)}
                className={`
                  relative p-2 min-h-[80px] border border-border rounded-lg text-left transition-all duration-200
                  ${isCurrentMonth(day) ? 'bg-background hover:bg-muted' : 'bg-muted/30 text-muted-foreground'}
                  ${isToday(day) ? 'ring-2 ring-primary' : ''}
                  ${isSelected(day) ? 'bg-primary/10 border-primary' : ''}
                  ${dayBills?.length > 0 ? 'hover:shadow-md' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                    {day?.getDate()}
                  </span>
                  {dayBills?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {hasOverdue && <div className="w-2 h-2 bg-error rounded-full"></div>}
                      {hasPending && <div className="w-2 h-2 bg-warning rounded-full"></div>}
                      {hasScheduled && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      {hasPaid && <div className="w-2 h-2 bg-success rounded-full"></div>}
                    </div>
                  )}
                </div>
                {dayBills?.length > 0 && (
                  <div className="space-y-1">
                    {dayBills?.slice(0, 2)?.map((bill, billIndex) => (
                      <div
                        key={billIndex}
                        className={`
                          text-xs p-1 rounded truncate
                          ${bill?.status === 'paid' ? 'bg-success/20 text-success' : ''}
                          ${bill?.status === 'pending' ? 'bg-warning/20 text-warning' : ''}
                          ${bill?.status === 'overdue' ? 'bg-error/20 text-error' : ''}
                          ${bill?.status === 'scheduled' ? 'bg-primary/20 text-primary' : ''}
                        `}
                      >
                        {bill?.payeeName}
                      </div>
                    ))}
                    
                    {dayBills?.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayBills?.length - 2} more
                      </div>
                    )}
                    
                    {totalAmount > 0 && (
                      <div className="text-xs font-medium text-foreground mt-1">
                        ${totalAmount?.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Selected date details */}
      {selectedDate && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h3 className="font-medium text-foreground mb-2">
            {selectedDate?.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          {getBillsForDate(selectedDate)?.length > 0 ? (
            <div className="space-y-2">
              {getBillsForDate(selectedDate)?.map((bill) => (
                <div key={bill?.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      bill?.status === 'paid' ? 'bg-success' :
                      bill?.status === 'pending' ? 'bg-warning' :
                      bill?.status === 'overdue' ? 'bg-error' : 'bg-primary'
                    }`}></div>
                    <span className="text-sm font-medium text-foreground">{bill?.payeeName}</span>
                  </div>
                  <span className="text-sm text-foreground">${bill?.amount?.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium text-foreground">Total:</span>
                <span className="text-sm font-semibold text-foreground">
                  ${getTotalAmountForDate(selectedDate)?.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payments scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentCalendar;