import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

function Home() {
  const [dados, setDados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchMedicoes = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/medicoes/list`,
          {
            search: "",
            page: 1,
            pageSize: 20,
            order: "-comodo",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formatados = response.data.items.map(item => ({
          id: item.id,
          comodo: item.nomeComodo,
          sinal24: item.nivelSinal2_4ghz,
          sinal5: item.nivelSinal5ghz,
          velocidade24: item.velocidade2_4ghz,
          velocidade5: item.velocidade5ghz,
          interferencia: item.interferencia,
          dataHora: new Date(item.dataHora).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setDados(formatados);
      } catch (error) {
        console.error("Erro ao buscar medições:", error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar medições.'
        });
      }
    };

    fetchMedicoes();
  }, [navigate]);

  const handleEdit = async (index) => {
    const item = dados[index];

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redireciona para a tela de edição, passando os dados via state
      navigate('/editamedicao', { state: response.data });

    } catch (error) {
      console.error("Erro ao buscar dados da medição:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os dados da medição para edição.'
      });
    }
  };

  const handleDelete = async (index) => {
    const item = dados[index];

    const confirm = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir a medição de "${item.comodo}"?`,
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/medicoes/${item.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDados((prev) => prev.filter((_, i) => i !== index));

        Swal.fire({
          title: 'Excluído!',
          text: 'A medição foi removida com sucesso.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Erro ao excluir:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível excluir a medição.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Medições de Internet</h1>
      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Cômodo</th>
              <th className="px-4 py-2 text-left">Sinal 2.4 GHz (dBm)</th>
              <th className="px-4 py-2 text-left">Sinal 5 GHz (dBm)</th>
              <th className="px-4 py-2 text-left">Velocidade 2.4 GHz (Mbps)</th>
              <th className="px-4 py-2 text-left">Velocidade 5 GHz (Mbps)</th>
              <th className="px-4 py-2 text-left">Interferência (dBm)</th>
              <th className="px-4 py-2 text-left">Data e Hora</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dados.map((linha, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{linha.comodo}</td>
                <td className="px-4 py-2">{linha.sinal24} dBm</td>
                <td className="px-4 py-2">{linha.sinal5} dBm</td>
                <td className="px-4 py-2">{linha.velocidade24} Mbps</td>
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
                    onClick={() => handleDelete(index)}
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
