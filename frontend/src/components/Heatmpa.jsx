import React, { useState, useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

// Seus dados de exemplo (viriam de uma API)
const exampleApiData = {
    "statusCode": 200,
    "medias": [
        { "nomeComodo": "Quarto 2", "mediaSinal2_4ghz": "-40.0", "mediaSinal5ghz": "-72.0", "mediaVelocidade2_4ghz": "102.0", "mediaVelocidade5ghz": "130.0", "mediaInterferencia": "-33.0" },
        { "nomeComodo": "Garagem", "mediaSinal2_4ghz": "-50.0", "mediaSinal5ghz": "-35.0", "mediaVelocidade2_4ghz": "100.0", "mediaVelocidade5ghz": "150.0", "mediaInterferencia": "-40.0" },
        { "nomeComodo": "Sala", "mediaSinal2_4ghz": "-51.5", "mediaSinal5ghz": "-41.3", "mediaVelocidade2_4ghz": "79.1", "mediaVelocidade5ghz": "150.2", "mediaInterferencia": "-28.0" },
        { "nomeComodo": "Quarto", "mediaSinal2_4ghz": "-30.0", "mediaSinal5ghz": "-15.0", "mediaVelocidade2_4ghz": "150.0", "mediaVelocidade5ghz": "300.0", "mediaInterferencia": "-10.0" },
        { "nomeComodo": "Banheiro", "mediaSinal2_4ghz": "-30.0", "mediaSinal5ghz": "-56.0", "mediaVelocidade2_4ghz": "75.0", "mediaVelocidade5ghz": "140.0", "mediaInterferencia": "-37.0" }
    ]
};

const metricOptions = [
    { value: 'mediaSinal2_4ghz', label: 'Sinal 2.4 GHz (dBm)', type: 'signal' },
    { value: 'mediaSinal5ghz', label: 'Sinal 5 GHz (dBm)', type: 'signal' },
    { value: 'mediaVelocidade2_4ghz', label: 'Velocidade 2.4 GHz (Mbps)', type: 'speed' },
    { value: 'mediaVelocidade5ghz', label: 'Velocidade 5 GHz (Mbps)', type: 'speed' },
    { value: 'mediaInterferencia', label: 'Interferência (dBm)', type: 'interference' },
];

function NetworkHeatmap() {
    const [floorPlanImage, setFloorPlanImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, displayWidth: 0, displayHeight: 0 });
    const [routerPosition, setRouterPosition] = useState(null);
    const [roomPositions, setRoomPositions] = useState([]);
    const [selectedRoomName, setSelectedRoomName] = useState('');
    const [networkData, setNetworkData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState(metricOptions[0].value);
    const [placementMode, setPlacementMode] = useState(null);
    const [heatmapDataPoints, setHeatmapDataPoints] = useState({ max: 1, data: [] }); // Estado para os dados do heatmap

    const imageContainerRef = useRef(null);
    const heatmapContainerRef = useRef(null);
    const heatmapInstanceRef = useRef(null);
    const imageRef = useRef(null); // Referência para o elemento <img>

    useEffect(() => {
        setNetworkData(exampleApiData.medias);
        if (exampleApiData.medias.length > 0) {
            setSelectedRoomName(exampleApiData.medias[0].nomeComodo);
        }
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFloorPlanImage(e.target.result);
                // As dimensões serão definidas no onLoad da tag <img>
            };
            reader.readAsDataURL(file);
            setRouterPosition(null);
            setRoomPositions([]);
            setHeatmapDataPoints({ max: 1, data: [] }); // Limpa dados do heatmap
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

    // Efeito para gerenciar a instância do heatmap e o tamanho do container
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
            // Reaplicar dados após recriação, pois o canvas é novo
            heatmapInstanceRef.current.setData(heatmapDataPoints);
        }

        Object.assign(heatmapContainerRef.current.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '10',
            pointerEvents: 'none'
        });

    }, [imageDimensions, heatmapDataPoints]); // Adicionar heatmapDataPoints garante que dados sejam redesenhados em canvas recriado

    // Efeito para atualizar os dados no heatmap quando heatmapDataPoints muda
    useEffect(() => {
        if (heatmapInstanceRef.current) {
            heatmapInstanceRef.current.setData(heatmapDataPoints);
        }
    }, [heatmapDataPoints]);


    const handleGenerateHeatmap = () => {
        if (roomPositions.length === 0 || !selectedMetric || !networkData.length) {
            alert("Por favor, marque os cômodos na planta e selecione uma métrica.");
            setHeatmapDataPoints({ max: 1, data: [] }); // Limpa o heatmap se não houver dados
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

        let heatmapMax = currentMaxValue;
        const metricConfig = metricOptions.find(m => m.value === selectedMetric);
        if (metricConfig) {
            if (metricConfig.type === 'signal') heatmapMax = 75;
            else if (metricConfig.type === 'interference') heatmapMax = 90;
            else if (metricConfig.type === 'speed') heatmapMax = Math.max(200, currentMaxValue) || 200;
        }
        heatmapMax = heatmapMax === 0 ? (metricConfig?.type === 'speed' ? 100 : 50) : heatmapMax; // Evitar max 0

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

    // Recalcular dimensões da imagem em caso de redimensionamento da janela
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
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Análise de Rede com Heatmap</h1>

            <div>
                <label htmlFor="floorPlanUpload" className="block text-sm font-medium text-gray-700">
                    1. Carregar Planta Baixa (.jpg, .png)
                </label>
                <input
                    type="file"
                    id="floorPlanUpload"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {floorPlanImage && (
                <>
                    <div className="flex flex-wrap gap-4 items-center">
                        <button
                            onClick={() => setPlacementMode('router')}
                            disabled={placementMode === 'router'}
                            className={`px-4 py-2 rounded text-white ${placementMode === 'router' ? 'bg-orange-600' : 'bg-orange-400 hover:bg-orange-500'}`}
                        >
                            {routerPosition ? "Reposicionar" : "Marcar"} Roteador
                        </button>

                        <div className="flex items-center gap-2">
                            <select
                                value={selectedRoomName}
                                onChange={(e) => {
                                    setSelectedRoomName(e.target.value);
                                    setPlacementMode('room');
                                }}
                                disabled={networkData.length === 0}
                                className="p-2 border rounded"
                            >
                                {networkData.map(room => (
                                    <option key={room.nomeComodo} value={room.nomeComodo}>
                                        {room.nomeComodo}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setPlacementMode('room')}
                                disabled={!selectedRoomName || placementMode === 'room'}
                                className={`px-4 py-2 rounded text-white ${placementMode === 'room' && selectedRoomName ? 'bg-indigo-600' : 'bg-indigo-400 hover:bg-indigo-500'}`}
                            >
                                Marcar {selectedRoomName || "Cômodo"}
                            </button>
                        </div>
                        {placementMode && <p className="text-sm text-gray-600 italic">Clique na imagem para marcar: {placementMode === 'router' ? 'Roteador' : selectedRoomName}.</p>}
                    </div>

                    {networkData.length > 0 && (
                        <div>
                            <h3 className="text-md font-semibold mb-1">Cômodos Marcados:</h3>
                            <div className="flex flex-wrap gap-2">
                                {networkData.map(room => (
                                    <span key={room.nomeComodo} className={`px-2 py-1 text-xs rounded-full text-white ${getRoomMarkerColor(room.nomeComodo)}`}>
                                        {room.nomeComodo}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="metricSelect" className="block text-sm font-medium text-gray-700">
                            Selecione a Métrica:
                        </label>
                        <select
                            id="metricSelect"
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {metricOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-4 my-4">
                        <button
                            onClick={handleGenerateHeatmap}
                            disabled={roomPositions.length === 0}
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                        >
                            Gerar Heatmap
                        </button>
                        <button
                            onClick={handleClearHeatmap}
                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Limpar Heatmap
                        </button>
                    </div>


                    <div
                        ref={imageContainerRef}
                        onClick={handleImageClick}
                        className="relative w-full max-w-3xl mx-auto border border-gray-300 cursor-crosshair"
                        style={imageDimensions.width ? { aspectRatio: `${imageDimensions.width}/${imageDimensions.height}` } : {}}
                    >
                        <img
                            ref={imageRef}
                            src={floorPlanImage}
                            alt="Planta Baixa"
                            className="block w-full h-auto z-0"
                            onLoad={handleImageLoad}
                        />

                        <div
                            ref={heatmapContainerRef}
                            className="absolute top-0 left-0 z-10 pointer-events-none"
                            style={{
                                width: `${imageDimensions.displayWidth}px`,
                                height: `${imageDimensions.displayHeight}px`,
                            }}
                        />

                        {/* Camada dos Marcadores Visuais (sobre o heatmap e a imagem) */}
                        {routerPosition && (
                            <div
                                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                                style={{ left: `${routerPosition.x}px`, top: `${routerPosition.y}px` }}
                                title="Roteador"
                            ></div>
                        )}

                        {roomPositions.map(room => (
                            <div
                                key={room.name}
                                // Se você quiser que os marcadores de cômodo (os pontos azuis) também fiquem sobre o heatmap:
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                                style={{ left: `${room.x}px`, top: `${room.y}px` }}
                            >
                                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                                <span className="text-xs bg-black bg-opacity-50 text-white p-0.5 rounded whitespace-nowrap">{room.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default NetworkHeatmap;