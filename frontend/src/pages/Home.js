import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

function Home() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: "comodo", direcao: "asc" });
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const fileInputRef = useRef(null);
  const longPressTimer = useRef(null);
  const navigate = useNavigate();
  const [mostrarImportBox, setMostrarImportBox] = useState(false);
  const inputFileRef = useRef(null);

  useEffect(() => {
    buscarMedicoes();
  }, [ordenacao]);

  const buscarMedicoes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/medicoes/list`,
        {
          search: "",
          page: 1,
          pageSize: 100,
          order: (ordenacao.direcao === "asc" ? "" : "-") + ordenacao.campo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formatados = response.data.items.map(item => {
        const [date, time] = item.dataHora.replace('Z', '').split('T');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;
        return {
          id: item.id,
          comodo: item.nomeComodo,
          sinal24: item.nivelSinal2_4ghz,
          sinal5: item.nivelSinal5ghz,
          velocidade24: item.velocidade2_4ghz,
          velocidade5: item.velocidade5ghz,
          interferencia: item.interferencia,
          dataHora: formattedDateTime,
          rawDate: new Date(item.dataHora)
        };
      });

      setDados(formatados);
    } catch (error) {
      console.error("Erro ao buscar medições:", error);
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao carregar medições.' });
    }
  };

  const handleSort = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc"
    }));
  };

  const getSetaOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === "asc" ? "↑" : "↓";
  };

  const handleEdit = async (index) => {
    const item = dados[index];
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/editamedicao', { state: response.data });
    } catch (error) {
      console.error("Erro ao buscar dados da medição:", error);
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível carregar os dados da medição para edição.' });
    }
  };

  const handleDeleteSelecionados = async () => {
    const confirm = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir ${selecionados.length} medições selecionadas?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await Promise.all(selecionados.map(id =>
          axios.delete(`${process.env.REACT_APP_API_URL}/medicoes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ));
        setDados(prev => prev.filter(item => !selecionados.includes(item.id)));
        setSelecionados([]);
        setModoSelecao(false);
        Swal.fire('Excluído!', 'As medições foram removidas com sucesso.', 'success');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        Swal.fire('Erro!', 'Não foi possível excluir as medições.', 'error');
      }
    }
  };

  const handleSelect = (id) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const iniciarSelecaoComDelay = (id) => {
    longPressTimer.current = setTimeout(() => {
      setModoSelecao(true);
      setSelecionados([id]);
    }, 2000);
  };

  const cancelarSelecaoComDelay = () => {
    clearTimeout(longPressTimer.current);
  };

  const cancelarSelecao = () => {
    setModoSelecao(false);
    setSelecionados([]);
  };

  const handleDownloadModelo = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/modelo?format=xlsx`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modelo_medicoes.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao baixar modelo.' });
    }
  };

  const handleUploadModelo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/medicoes/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Importação concluída com sucesso.' });
      buscarMedicoes(); 
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao importar o arquivo.' });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Medições de Internet</h1>
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <input
          type="text"
          placeholder="Buscar por cômodo"
          className="p-2 border rounded w-full md:max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="relative w-full md:w-auto"> 
          <button
            onClick={() => setMostrarImportBox(prev => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full" // Botão sempre com largura total do seu contêiner relativo
          >
            Importar/Exportar
          </button>

          {mostrarImportBox && (
            <div className="absolute right-0 mt-2 p-3 bg-white border border-gray-200 rounded-md shadow-xl w-full md:w-auto md:min-w-[240px] space-y-2 z-20">
              <button
                onClick={handleDownloadModelo}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 w-full text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Baixar modelo
              </button>
              <button
                onClick={() => inputFileRef.current?.click()}
                className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 w-full text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Upload modelo preenchido
              </button>
              <input
                type="file"
                accept=".xlsx"
                ref={inputFileRef}
                onChange={handleUploadModelo}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
      <div className="overflow-auto rounded shadow bg-white">
        {modoSelecao && (
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <button
              onClick={handleDeleteSelecionados}
              className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Excluir medições selecionadas
            </button>
            <button
              onClick={cancelarSelecao}
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline focus:outline-none"
            >
              Cancelar seleção
            </button>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {modoSelecao && <th className="px-2 py-3"></th>}
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("comodo")}>Cômodo {getSetaOrdenacao("comodo")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("sinal2_4ghz")}>Sinal 2.4 GHz (dBm) {getSetaOrdenacao("sinal2_4ghz")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("sinal5ghz")}>Sinal 5 GHz (dBm) {getSetaOrdenacao("sinal5ghz")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("velocidade2_4ghz")}>Velocidade 2.4 GHz (Mbps) {getSetaOrdenacao("velocidade2_4ghz")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("velocidade5ghz")}>Velocidade 5 GHz (Mbps) {getSetaOrdenacao("velocidade5ghz")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("interferencia")}>Interferência (dBm) {getSetaOrdenacao("interferencia")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort("dataHora")}>Data e Hora {getSetaOrdenacao("dataHora")}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {dados
              .filter(item => item.comodo.toLowerCase().includes(filtro.toLowerCase()))
              .map((linha, index) => (
                <tr
                  key={linha.id}
                  onMouseDown={() => iniciarSelecaoComDelay(linha.id)}
                  onMouseUp={cancelarSelecaoComDelay}
                  onMouseLeave={cancelarSelecaoComDelay}
                  className={`${selecionados.includes(linha.id) ? "bg-yellow-100 hover:bg-yellow-200" : "hover:bg-gray-50"} transition-colors duration-150`}
                >
                  {modoSelecao && (
                    <td className="px-2 py-2.5">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selecionados.includes(linha.id)}
                        onChange={() => handleSelect(linha.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.comodo}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.sinal24} dBm</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.sinal5} dBm</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.velocidade24} Mbps</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.velocidade5} Mbps</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.interferencia} dBm</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{linha.dataHora}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSelecionados(index)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        aria-label="Excluir"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;

// -> /medicoes/modelo?format=xlxs
// -> /medicoes/import