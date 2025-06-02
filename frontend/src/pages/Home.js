import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import html2pdf from "html2pdf.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import Heatmpa from '../components/Heatmpa';


function Home() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: "comodo", direcao: "asc" });
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const tabelaRef = useRef(null);
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const [medicoes, setMedicoes] = useState([]);
  const [medias, setMedias] = useState([]);
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);




  const navigate = useNavigate();
  const fetchMedias = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/medias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.medias) {
        setMedias(response.data.medias)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    buscarMedicoes();
    fetchMedias()
  }, [ordenacao]);

  const gerarPdf = async () => {
    setGerandoPdf(true); // começa o loading
    setMostrarGraficos(true);

    try {
      await fetchMedias();

      document.body.style.overflow = 'hidden';
      await new Promise(resolve => setTimeout(resolve, 500));

      window.dispatchEvent(new Event('resize'));

      const elemento = tabelaRef.current;
      const opt = {
        margin: 0.5,
        filename: 'relatorio_medicoes.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      await html2pdf().set(opt).from(elemento).save();
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setMostrarGraficos(false);
      document.body.style.overflow = 'auto';
      setGerandoPdf(false); // termina o loading
    }
  };





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
          sinal2_4: item.nivelSinal2_4ghz,
          sinal5: item.nivelSinal5ghz,
          velocidade2_4: item.velocidade2_4ghz,
          velocidade5: item.velocidade5ghz,
          interferencia: item.interferencia,
          dataHora: formattedDateTime,
          rawDate: new Date(item.dataHora)
        };
      });

      setMedicoes(formatados);
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
    console.log("Editando medição no índice:", index);
    console.log("medicoes:", medicoes);
    const item = medicoes[index];
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/medicoes/multi-delete`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: selecionados }
          }
        );
        setMedicoes(prev => prev.filter(item => !selecionados.includes(item.id)));
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen" ref={tabelaRef}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Medições de Internet</h1>
        <div className="flex gap-2">
          <button data-html2canvas-ignore="true"
            onClick={gerarPdf}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Baixar PDF
          </button>

          {!modoSelecao ? (
            <button data-html2canvas-ignore="true"
              onClick={() => setModoSelecao(true)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Selecionar múltiplos
            </button>
          ) : (
            <>
              <button
                onClick={handleDeleteSelecionados}
                disabled={selecionados.length === 0}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Excluir selecionados
              </button>
              <button
                onClick={() => {
                  setModoSelecao(false);
                  setSelecionados([]);
                }}
                className="text-gray-600 hover:underline"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por cômodo"
        className="mb-4 p-2 border rounded w-full max-w-xs"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        data-html2canvas-ignore="true"
      />

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              {modoSelecao && (
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selecionados.length === medicoes.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelecionados(medicoes.map(d => d.id));
                      } else {
                        setSelecionados([]);
                      }
                    }}
                  />
                </th>
              )}
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("comodo")}>Cômodo {getSetaOrdenacao("comodo")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("sinal2_4")}>Sinal 2.4 GHz {getSetaOrdenacao("sinal2_4")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("sinal5")}>Sinal 5 GHz {getSetaOrdenacao("sinal5")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("velocidade2_4")}>Velocidade 2.4 GHz {getSetaOrdenacao("velocidade2_4")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("velocidade5")}>Velocidade 5 GHz {getSetaOrdenacao("velocidade5")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("interferencia")}>Interferência {getSetaOrdenacao("interferencia")}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("dataHora")}>Data e Hora {getSetaOrdenacao("dataHora")}</th>
              <th className="px-4 py-2 text-left" data-html2canvas-ignore="true">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {medicoes
              .filter(item => item.comodo.toLowerCase().includes(filtro.toLowerCase()))
              .map((linha, index) => (
                <tr
                  key={linha.id}
                  className={selecionados.includes(linha.id) ? "bg-yellow-100" : ""}
                >
                  {modoSelecao && (
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(linha.id)}
                        onChange={() => handleSelect(linha.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-2">{linha.comodo}</td>
                  <td className="px-4 py-2">{linha.sinal2_4} dBm</td>
                  <td className="px-4 py-2">{linha.sinal5} dBm</td>
                  <td className="px-4 py-2">{linha.velocidade2_4} Mbps</td>
                  <td className="px-4 py-2">{linha.velocidade5} Mbps</td>
                  <td className="px-4 py-2">{linha.interferencia} dBm</td>
                  <td className="px-4 py-2">{linha.dataHora}</td>
                  <td className="px-4 py-2 flex gap-2" data-html2canvas-ignore="true">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={async () => {
                        const confirm = await Swal.fire({
                          title: 'Tem certeza?',
                          text: 'Deseja excluir esta medição?',
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
                            await axios.delete(`${process.env.REACT_APP_API_URL}/medicoes/${linha.id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            setMedicoes(prev => prev.filter(item => item.id !== linha.id));
                            Swal.fire('Excluído!', 'A medição foi removida com sucesso.', 'success');
                          } catch (error) {
                            console.error('Erro ao excluir:', error);
                            Swal.fire('Erro!', 'Não foi possível excluir a medição.', 'error');
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: mostrarGraficos ? "block" : "none" }} ref={tabelaRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">Resultado do nível de sinal (dbm)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={medias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nomeComodo" />
                <YAxis domain={[-100, 0]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mediaSinal2_4ghz" name="2,4GHz" fill="#1e40af" />
                <Bar dataKey="mediaSinal5ghz" name="5GHz" fill="#dc2626" />
                <Bar dataKey="mediaInterferencia" name="Interferência" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-center mb-2">Velocidade da rede WiFi</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart width={600} height={400} data={medias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nomeComodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mediaVelocidade2_4ghz" name="2,4GHz" fill="#1e40af" />
                <Bar dataKey="mediaVelocidade5ghz" name="5GHz" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {gerandoPdf && (
        <div data-html2canvas-ignore="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20 mb-4 animate-spin border-t-blue-600"></div>
            <p className="text-white text-lg">Gerando PDF...</p>
          </div>
        </div>
      )}
    </div>

  );
}

export default Home;
