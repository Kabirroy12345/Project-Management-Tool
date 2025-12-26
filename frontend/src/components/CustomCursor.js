import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseDown = () => {
            setClicked(true);
        };

        const onMouseUp = () => {
            setClicked(false);
        };

        const handleLinkHoverEvents = () => {
            document.querySelectorAll("a, button, input, textarea, select, .cursor-hover").forEach((el) => {
                el.addEventListener("mouseover", () => setLinkHovered(true));
                el.addEventListener("mouseout", () => setLinkHovered(false));
            });
        };

        addEventListeners();
        handleLinkHoverEvents();

        // Re-add hover listeners on DOM changes (simple MutationObserver alternative)
        const observer = new MutationObserver(handleLinkHoverEvents);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            removeEventListeners();
            observer.disconnect();
        };
    }, []);

    const cursorClasses = `custom-cursor ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${linkHovered ? 'hovered' : ''}`;

    return (
        <div className={cursorClasses} style={{ left: `${position.x}px`, top: `${position.y}px` }}>
            <div className="cursor-dot"></div>
            <div className="cursor-ring"></div>
        </div>
    );
};

export default CustomCursor;
