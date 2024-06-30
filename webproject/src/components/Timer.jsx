import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Timer = ({isActive, onTimeUp}) => {
    const { t } = useTranslation();
    const [time, setTime] = useState(() => {
        const savedTime = localStorage.getItem('time');
        return savedTime ? parseInt(savedTime, 10) : 600;
    });

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        localStorage.removeItem('time');
                        onTimeUp();
                        return 0;
                    }
                    const newTime = prevTime - 1;
                    localStorage.setItem('time', newTime);
                    return newTime;
                });
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isActive, onTimeUp, time]);

    return (
        <div>
            <h1>{t ('time')}: {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</h1>
        </div>
    );
}

export default Timer;