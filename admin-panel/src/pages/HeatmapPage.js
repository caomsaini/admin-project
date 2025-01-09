import React, { useEffect } from "react";

const HeatmapPage = () => {
    useEffect(() => {
        const handleClick = (e) => {
            const interactionData = {
                x: e.clientX,
                y: e.clientY,
                page: window.location.pathname,
            };

            // Send data to backend
            fetch("http://localhost:5000/api/heatmaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(interactionData),
            });
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return <div>Click anywhere to track interactions</div>;
};

export default HeatmapPage;