import React, { useEffect, useState } from "react";

const HeatmapVisualization = () => {
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            const response = await fetch("http://localhost:5000/api/heatmaps/some-page");
            const data = await response.json();
            setHeatmapData(data);
        };

        fetchHeatmapData();
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {heatmapData.map((point, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: point.y,
                        left: point.x,
                        width: "10px",
                        height: "10px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                    }}
                />
            ))}
        </div>
    );
};

export default HeatmapVisualization;