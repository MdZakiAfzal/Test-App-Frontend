import { useState, useEffect } from 'react';

// Add a new prop called 'onTimeUp'
function Timer({ durationInMinutes, startTime, onTimeUp }) {
  if (!durationInMinutes || !startTime) {
    return <div>Loading timer...</div>;
  }

  const endTime = new Date(new Date(startTime).getTime() + durationInMinutes * 60 * 1000);

  const calculateRemainingTime = () => {
    const now = new Date();
    const difference = endTime.getTime() - now.getTime();
    return difference > 0 ? difference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);
    
    if (remainingTime <= 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  // This effect now calls the onTimeUp function when time expires
  useEffect(() => {
    if (remainingTime > 0 && remainingTime < 1000) {
      // Call the function passed from the parent component
      if (onTimeUp) onTimeUp();
    }
  }, [remainingTime]);

  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
      Time Left: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

export default Timer;