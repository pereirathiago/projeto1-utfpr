import React, { useState, useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

const metricOptions = [
    { value: 'mediaSinal2_4ghz', label: 'Sinal 2.4 GHz (dBm)', type: 'signal' },
    { value: 'mediaSinal5ghz', label: 'Sinal 5 GHz (dBm)', type: 'signal' },
    { value: 'mediaVelocidade2_4ghz', label: 'Velocidade 2.4 GHz (Mbps)', type: 'speed' },
    { value: 'mediaVelocidade5ghz', label: 'Velocidade 5 GHz (Mbps)', type: 'speed' },
    { value: 'mediaInterferencia', label: 'Interferência (dBm)', type: 'interference' },
];

function NetworkHeatmap({mediasApiData}) {
    const [floorPlanImage, setFloorPlanImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, displayWidth: 0, displayHeight: 0 });
    const [routerPosition, setRouterPosition] = useState(null);
    const [roomPositions, setRoomPositions] = useState([]);
    const [selectedRoomName, setSelectedRoomName] = useState('');
    const [networkData, setNetworkData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState(metricOptions[0].value);
    const [placementMode, setPlacementMode] = useState(null);
    const [heatmapDataPoints, setHeatmapDataPoints] = useState({ max: 1, data: [] });

    const imageContainerRef = useRef(null);
    const heatmapContainerRef = useRef(null);
    const heatmapInstanceRef = useRef(null);
    const imageRef = useRef(null);



    useEffect(() => {
        setNetworkData(mediasApiData);
        if (mediasApiData.length > 0) {
            setSelectedRoomName(mediasApiData[0].nomeComodo);
        }
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFloorPlanImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setRouterPosition(null);
            setRoomPositions([]);
            setHeatmapDataPoints({ max: 1, data: [] });
        }
    };

    const handleImageLoad = (event) => {
        const img = event.target;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
            displayWidth: img.offsetWidth,
            displayHeight: img.offsetHeight
        });
    };


    const handleImageClick = (event) => {
        if (!imageContainerRef.current || (!placementMode && selectedRoomName === '')) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);

        if (placementMode === 'router') {
            setRouterPosition({ x, y });
            setPlacementMode(null);
        } else if (placementMode === 'room' && selectedRoomName) {
            const roomData = networkData.find(r => r.nomeComodo === selectedRoomName);
            if (roomData) {
                setRoomPositions(prev => {
                    const existing = prev.find(p => p.name === selectedRoomName);
                    if (existing) {
                        return prev.map(p => p.name === selectedRoomName ? { ...p, x, y } : p);
                    }
                    return [...prev, { name: selectedRoomName, x, y, data: roomData }];
                });
            }
        }
    };

    useEffect(() => {
        if (!heatmapContainerRef.current) return;

        const imgElement = imageRef.current;
        if (!imgElement || !imageDimensions.width || !imageDimensions.height || !imgElement.offsetWidth || !imgElement.offsetHeight) {
            if (heatmapInstanceRef.current) {
                const canvas = heatmapContainerRef.current.querySelector('canvas');
                if (canvas) heatmapContainerRef.current.removeChild(canvas);
                heatmapInstanceRef.current = null;
            }
            return;
        }

        const displayWidth = imgElement.offsetWidth;
        const displayHeight = imgElement.offsetHeight;

        const currentCanvas = heatmapContainerRef.current.querySelector('canvas');
        const needsRecreation = !heatmapInstanceRef.current || !currentCanvas ||
            currentCanvas.width !== displayWidth ||
            currentCanvas.height !== displayHeight;

        if (needsRecreation) {
            if (currentCanvas) {
                heatmapContainerRef.current.removeChild(currentCanvas);
            }

            heatmapContainerRef.current.style.width = `${displayWidth}px`;
            heatmapContainerRef.current.style.height = `${displayHeight}px`;

            heatmapInstanceRef.current = h337.create({
                container: heatmapContainerRef.current,
                radius: 150, maxOpacity: 0.7, minOpacity: 0.1, blur: 0.85,
            });
            heatmapInstanceRef.current.setData(heatmapDataPoints);
        }

        Object.assign(heatmapContainerRef.current.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '10',
            pointerEvents: 'none'
        });

    }, [imageDimensions, heatmapDataPoints]);

    useEffect(() => {
        if (heatmapInstanceRef.current) {
            heatmapInstanceRef.current.setData(heatmapDataPoints);
        }
    }, [heatmapDataPoints]);

    const getLegendValues = (type) => {
        switch (type) {
            case 'mediaSinal2_4ghz':
            case 'mediaSinal5ghz':
                return { min: '-100 dBm', max: '-30 dBm' };
            case 'mediaInterferencia':
                return { min: '-90 dBm', max: '-50 dBm' };
            case 'mediaVelocidade2_4ghz':
                return { min: '0 Mbps', max: '150 Mbps' };
            case 'mediaVelocidade5ghz':
                return { min: '0 Mbps', max: '300 Mbps' };
            default:
                return { min: '0', max: '100' };
        }
    };

    const handleGenerateHeatmap = () => {
        if (roomPositions.length === 0 || !selectedMetric || !networkData.length) {
            alert("Por favor, marque os cômodos na planta e selecione uma métrica.");
            setHeatmapDataPoints({ max: 1, data: [] });
            return;
        }

        const points = [];
        let currentMaxValue = 0;

        roomPositions.forEach(room => {
            const metricData = room.data?.[selectedMetric];
            if (metricData !== undefined && metricData !== null) {
                let value = parseFloat(metricData);
                const metricConfig = metricOptions.find(m => m.value === selectedMetric);

                if (metricConfig) {
                    if (metricConfig.type === 'signal') value = value + 100;
                    else if (metricConfig.type === 'interference') value = -value;
                }
                points.push({ x: room.x, y: room.y, value: value });
                if (value > currentMaxValue) currentMaxValue = value;
            }
        });

        const legendValues = getLegendValues(selectedMetric);


        let heatmapMax = currentMaxValue;
        const metricConfig = metricOptions.find(m => m.value === selectedMetric);
        if (metricConfig) {
            if (metricConfig.type === 'signal') heatmapMax = 75;
            else if (metricConfig.type === 'interference') heatmapMax = 90;
            else if (metricConfig.type === 'speed') heatmapMax = Math.max(200, currentMaxValue) || 200;
        }
        heatmapMax = heatmapMax === 0 ? (metricConfig?.type === 'speed' ? 100 : 50) : heatmapMax;

        if (points.length > 0) {
            setHeatmapDataPoints({ max: heatmapMax, min: 0, data: points });
        } else {
            setHeatmapDataPoints({ max: 1, data: [] });
        }
    };

    const handleClearHeatmap = () => {
        setHeatmapDataPoints({ max: 1, data: [] });
    };

    const getRoomMarkerColor = (roomName) => {
        return roomPositions.find(r => r.name === roomName) ? 'bg-green-500' : 'bg-gray-300';
    };

    useEffect(() => {
        const updateImageDisplayDimensions = () => {
            if (imageRef.current) {
                setImageDimensions(prev => ({
                    ...prev,
                    displayWidth: imageRef.current.offsetWidth,
                    displayHeight: imageRef.current.offsetHeight,
                }));
            }
        };
        window.addEventListener('resize', updateImageDisplayDimensions);
        return () => window.removeEventListener('resize', updateImageDisplayDimensions);
    }, []);


    return (
        <div className="max-w-screen-xl mx-auto p-6 space-y-6 font-sans">
            <h1 className="text-3xl font-bold text-gray-800">Análise de Rede - Heatmap</h1>

            <div className="mb-4">
                <label
                    htmlFor="floorPlanUpload"
                    className="block text-sm font-medium text-gray-700"
                >
                    1. Carregar Planta Baixa (.jpg, .png)
                </label>
                <input
                    type="file"
                    id="floorPlanUpload"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {floorPlanImage && (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem com marcadores */}
                    <div
                        ref={imageContainerRef}
                        onClick={handleImageClick}
                        className="relative w-full lg:w-2/3 border border-gray-300 rounded-lg overflow-hidden aspect-[4/3] cursor-crosshair"
                    >
                        <img
                            ref={imageRef}
                            src={floorPlanImage}
                            alt="Planta Baixa"
                            className="w-full h-full object-contain"
                            onLoad={handleImageLoad}
                        />

                        <div
                            ref={heatmapContainerRef}
                            className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                        />

                        {routerPosition && (
                            <div
                                className="absolute w-5 h-5 bg-red-600 border-2 border-white rounded-full z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${routerPosition.x}px`, top: `${routerPosition.y}px` }}
                                title="Roteador"
                            />
                        )}

                        {/* Cômodos */}
                        {roomPositions.map((room) => (
                            <div
                                key={room.name}
                                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${room.x}px`, top: `${room.y}px` }}
                            >
                                <div className="w-4 h-4 bg-indigo-600 border-2 border-white rounded-full" />
                                <span className="absolute top-full mt-1 text-xs text-white bg-black bg-opacity-60 px-1 rounded">
                                    {room.name}
                                </span>
                            </div>
                        ))}

                        {placementMode && (
                            <div className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-60 px-3 py-1 rounded z-30">
                                Clique na imagem para marcar:{" "}
                                {placementMode === "router" ? "Roteador" : selectedRoomName}.
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => setPlacementMode("router")}
                                disabled={placementMode === "router"}
                                className={`w-full px-4 py-2 rounded-lg text-white ${placementMode === "router"
                                    ? "bg-orange-600"
                                    : "bg-orange-400 hover:bg-orange-500"
                                    }`}
                            >
                                {routerPosition ? "Reposicionar" : "Marcar"} Roteador
                            </button>

                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedRoomName}
                                    onChange={(e) => {
                                        setSelectedRoomName(e.target.value);
                                        setPlacementMode("room");
                                    }}
                                    disabled={networkData.length === 0}
                                    className="flex-1 p-2 border rounded"
                                >
                                    {networkData.map((room) => (
                                        <option key={room.nomeComodo} value={room.nomeComodo}>
                                            {room.nomeComodo}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setPlacementMode("room")}
                                    disabled={!selectedRoomName || placementMode === "room"}
                                    className={`px-4 py-2 rounded-lg text-white ${placementMode === "room" && selectedRoomName
                                        ? "bg-indigo-600"
                                        : "bg-indigo-400 hover:bg-indigo-500"
                                        }`}
                                >
                                    Marcar
                                </button>
                            </div>
                        </div>

                        {networkData.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold">Cômodos Marcados:</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {networkData.map((room) => (
                                        <span
                                            key={room.nomeComodo}
                                            className={`px-2 py-1 text-xs rounded-full text-white ${getRoomMarkerColor(
                                                room.nomeComodo
                                            )}`}
                                        >
                                            {room.nomeComodo}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="metricSelect"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tipo de Heatmap:
                            </label>
                            <select
                                id="metricSelect"
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {metricOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleGenerateHeatmap}
                                disabled={roomPositions.length === 0}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
                            >
                                Gerar Heatmap
                            </button>

                            <button
                                onClick={handleClearHeatmap}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Limpar
                            </button>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Legenda</h3>
                            <div className="w-full max-w-md">
                                <div className="h-4 w-full bg-gradient-to-r from-blue-500 via-green-300 to-red-500 rounded" />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{getLegendValues(selectedMetric).min}</span>
                                    <span>{getLegendValues(selectedMetric).max}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NetworkHeatmap;