import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-sm">
      <div className="text-3xl font-semibold text-primary-600">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {format(time, 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
}

export default Clock; 