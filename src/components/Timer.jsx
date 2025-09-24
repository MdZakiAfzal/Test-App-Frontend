import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (remainingTime > 0 && remainingTime < 1000) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [remainingTime, onTimeUp]);

  // Updated formatting logic to include hours
  const hours = Math.floor(remainingTime / 1000 / 60 / 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
      Time Left: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

export default Timer;