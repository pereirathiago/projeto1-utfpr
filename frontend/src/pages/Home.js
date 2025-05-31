import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

function Home() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: "comodo", direcao: "asc" });
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState([]);

  const navigate = useNavigate();

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
          sinal2_4: item.nivelSinal2_4ghz,
          sinal5: item.nivelSinal5ghz,
          velocidade2_4: item.velocidade2_4ghz,
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/medicoes/multi-delete`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: selecionados }
          }
        );
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Medições de Internet</h1>
        <div className="flex gap-2">
          {!modoSelecao ? (
            <button
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
      />

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              {modoSelecao && (
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selecionados.length === dados.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelecionados(dados.map(d => d.id));
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
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dados
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
                  <td className="px-4 py-2 flex gap-2">
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
                            setDados(prev => prev.filter(item => item.id !== linha.id));
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
    </div>
  );
}

export default Home;
