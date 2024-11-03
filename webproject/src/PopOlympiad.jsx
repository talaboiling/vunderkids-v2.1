import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
const PopOlympiad = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null); // Use a ref to access the dialog element

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleBackgroundClick = (event) => {
        // Close the modal if the click is on the background
        if (event.target === dialogRef.current) {
            handleClose();
        }
    };

    return (
        <>
            {isOpen && (
                <dialog
                    ref={dialogRef}
                    open
                    className='olympmodal'
                    onClick={handleBackgroundClick} // Attach the background click handler
                >
                    <div className="olympmodal-content">
                        <CloseIcon className='popCloseIcon' onClick={handleClose} sx={{fontSize:"50px"}}/>
                        <span className='olympmodal-header'>
                            <h1 style={{ animation: "none", color: 'white' }}>ОЛИМПИАДА ПО МАТЕМАТИКЕ</h1>
                            <p className='olymp-info'>ПРИЗОВОЙ ФОНД 500 000 ТГ</p>
                        </span>
                        <Link to={"/olympiad-rules"}>
                            <button className='orangeButton'>ЗАРЕГИСТРИРОВАТЬСЯ</button>
                        </Link>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default PopOlympiad;
