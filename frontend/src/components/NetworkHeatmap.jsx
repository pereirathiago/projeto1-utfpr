import React, { useState, useRef, useEffect } from 'react';
import Heatmap from 'heatmap.js';
import { useMeasure } from 'react-use';
import './NetworkHeatmap.css';
import axios from 'axios'

const NetworkHeatmap = () => {
  // Estados do componente
  const [image, setImage] = useState(null);
  const [routerPosition, setRouterPosition] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [heatmapType, setHeatmapType] = useState('sinal2_4ghz');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectingRouter, setSelectingRouter] = useState(false);
  const [selectingRoom, setSelectingRoom] = useState(false);
const imageContainerRef = useRef(null);
  // Refs
  const containerRef = useRef(null);
  const heatmapContainerRef = useRef(null);

  // Opções de cômodos
  const roomOptions = ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Garagem', 'Quarto 2'];

  // Efeito para inicializar o heatmap
  useEffect(() => {
    if (heatmapContainerRef.current && !heatmapInstance) {
      const instance = Heatmap.create({
        container: heatmapContainerRef.current,
        radius: 40,
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.85,
        gradient: {
          '0.1': 'blue',
          '0.3': 'cyan',
          '0.5': 'lime',
          '0.7': 'yellow',
          '1.0': 'red'
        }
      });
      setHeatmapInstance(instance);
    }

    return () => {
      if (heatmapInstance) {
        heatmapInstance._renderer.canvas.remove();
      }
    };
  }, [heatmapInstance]);

  // Atualizar tamanho do heatmap quando a imagem carregar
  useEffect(() => {
    if (heatmapInstance && imageSize.width > 0) {
      heatmapInstance.configure({
        width: imageSize.width,
        height: imageSize.height
      });
    }
  }, [imageSize, heatmapInstance]);


  // Manipuladores de eventos
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setRouterPosition(null);
        setRooms([]);
        if (heatmapInstance) {
          heatmapInstance.setData({ max: 0, data: [] });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageSize({ width: naturalWidth, height: naturalHeight });
  };

  const handleContainerClick = (e) => {
    if (!image || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Coordenadas normalizadas (0-1)
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;

    if (selectingRouter) {
      setRouterPosition({ x: normalizedX, y: normalizedY });
      setSelectingRouter(false);
    } else if (selectingRoom && selectedRoom) {
      const newRoom = {
        name: selectedRoom,
        x: normalizedX,
        y: normalizedY
      };
      setRooms([...rooms, newRoom]);
      setSelectingRoom(false);
    }
  };

  const generateHeatmap = async () => {
    if (!heatmapInstance) {
      console.error('Heatmap instance não está pronta');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulação da API
      const mockData = {
        statusCode: 200,
        medias: [
          {
            nomeComodo: "Quarto 2",
            mediaSinal2_4ghz: "-40.0",
            mediaSinal5ghz: "-72.0",
            mediaVelocidade2_4ghz: "102.0",
            mediaVelocidade5ghz: "130.0",
            mediaInterferencia: "-33.0"
          },
          // ... outros cômodos
        ]
      };

      const data = mockData; // Substitua por sua chamada real à API

      if (data.statusCode === 200) {
        const heatmapData = rooms.map(room => {
          const roomData = data.medias.find(r => r.nomeComodo === room.name);
          const value = roomData ? getValueFromDataType(roomData, heatmapType) : 0;

          return {
            x: Math.round(room.x * imageSize.width),
            y: Math.round(room.y * imageSize.height),
            value: normalizeValue(value, heatmapType),
            radius: calculateRadius(value, heatmapType)
          };
        });

        // Adiciona o roteador como ponto central
        if (routerPosition) {
          heatmapData.push({
            x: Math.round(routerPosition.x * imageSize.width),
            y: Math.round(routerPosition.y * imageSize.height),
            value: 100, // Valor máximo
            radius: 60
          });
        }

        // Configura e renderiza o heatmap
        heatmapInstance.setData({
          max: 100,
          min: 0,
          data: heatmapData
        });
      }
    } catch (error) {
      console.error('Erro ao gerar heatmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Funções auxiliares
  const getValueFromDataType = (data, type) => {
    switch (type) {
      case 'sinal2_4ghz': return parseFloat(data.mediaSinal2_4ghz);
      case 'sinal5ghz': return parseFloat(data.mediaSinal5ghz);
      case 'velocidade2_4ghz': return parseFloat(data.mediaVelocidade2_4ghz);
      case 'velocidade5ghz': return parseFloat(data.mediaVelocidade5ghz);
      case 'interferencia': return parseFloat(data.mediaInterferencia);
      default: return 0;
    }
  };

  const normalizeValue = (value, type) => {
    // Normaliza os valores para ficarem em uma escala adequada
    switch (type) {
      case 'sinal2_4ghz':
      case 'sinal5ghz':
      case 'interferencia':
        // Para dBm, valores mais próximos de 0 são melhores
        return Math.min(100, Math.max(1, (Math.abs(value) - 30) * 3));
      default:
        // Para velocidade, valores maiores são melhores
        return Math.min(100, Math.max(1, value / 3));
    }
  };

  const calculateRadius = (value, type) => {
    // Calcula o raio baseado no tipo de métrica
    switch (type) {
      case 'sinal2_4ghz':
      case 'sinal5ghz':
        return 40 + Math.abs(value);
      case 'interferencia':
        return 30 + Math.abs(value) / 2;
      default:
        return 30 + value / 5;
    }
  };

  const getLegendValues = (type) => {
    switch (type) {
      case 'sinal2_4ghz':
      case 'sinal5ghz':
        return { min: '-100 dBm', max: '-30 dBm' };
      case 'interferencia':
        return { min: '-90 dBm', max: '-50 dBm' };
      case 'velocidade2_4ghz':
        return { min: '0 Mbps', max: '150 Mbps' };
      case 'velocidade5ghz':
        return { min: '0 Mbps', max: '300 Mbps' };
      default:
        return { min: '0', max: '100' };
    }
  };

  const legendValues = getLegendValues(heatmapType);

  return (
    <div className="heatmap-app">
      <h1>Análise de Rede - Heatmap</h1>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>

      {image && (
        <div className="main-content">
          <div
            ref={containerRef}
            className="image-container"
            onClick={handleContainerClick}
          >
            <div ref={imageContainerRef} className="image-wrapper">
              <img
                src={image}
                alt="Planta da casa"
                onLoad={handleImageLoad}
                className="house-image"
              />
            </div>

            <div
              ref={heatmapContainerRef}
              className="heatmap-container"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />

            {/* Marcador do roteador */}
            {routerPosition && (
              <div
                className="router-marker"
                style={{
                  left: `${routerPosition.x * 100}%`,
                  top: `${routerPosition.y * 100}%`
                }}
                title="Roteador"
              />
            )}

            {/* Marcadores dos cômodos */}
            {rooms.map((room, index) => (
              <div
                key={index}
                className="room-marker"
                style={{
                  left: `${room.x * 100}%`,
                  top: `${room.y * 100}%`
                }}
                title={room.name}
              >
                {room.name.charAt(0)}
              </div>
            ))}

            {/* Modo de seleção */}
            {(selectingRouter || selectingRoom) && (
              <div className="selection-mode">
                {selectingRouter ? 'Clique para marcar o roteador' : `Clique para marcar ${selectedRoom}`}
              </div>
            )}
          </div>

          <div className="control-panel">
            <div className="control-group">
              <h3>Configurações</h3>

              <div className="control-item">
                <button
                  onClick={() => setSelectingRouter(true)}
                  disabled={selectingRouter}
                  className={`control-button ${selectingRouter ? 'active' : ''}`}
                >
                  {routerPosition ? '✓ Roteador' : 'Marcar Roteador'}
                </button>
              </div>

              <div className="control-item">
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  disabled={selectingRoom}
                  className="room-select"
                >
                  <option value="">Selecione um cômodo</option>
                  {roomOptions.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                <button
                  onClick={() => setSelectingRoom(true)}
                  disabled={!selectedRoom || selectingRoom}
                  className={`control-button ${selectingRoom ? 'active' : ''}`}
                >
                  Marcar Cômodo
                </button>
              </div>

              <div className="control-item">
                <label>Tipo de Heatmap:</label>
                <select
                  value={heatmapType}
                  onChange={(e) => setHeatmapType(e.target.value)}
                  className="heatmap-select"
                >
                  <option value="sinal2_4ghz">Sinal 2.4 GHz (dBm)</option>
                  <option value="sinal5ghz">Sinal 5 GHz (dBm)</option>
                  <option value="velocidade2_4ghz">Velocidade 2.4 GHz (Mbps)</option>
                  <option value="velocidade5ghz">Velocidade 5 GHz (Mbps)</option>
                  <option value="interferencia">Interferência (dBm)</option>
                </select>
              </div>

              <div className="control-item">
                <button
                  onClick={generateHeatmap}
                  disabled={!routerPosition || rooms.length === 0 || isGenerating}
                  className="generate-button"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Heatmap'}
                </button>
              </div>
            </div>

            <div className="legend">
              <h3>Legenda</h3>
              <div className="gradient-bar">
                <div className="gradient" />
                <div className="labels">
                  <span>{legendValues.min}</span>
                  <span>{legendValues.max}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default NetworkHeatmap;