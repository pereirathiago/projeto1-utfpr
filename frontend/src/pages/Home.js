import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

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

        // Formatar a data e salvar os dados
        const formatados = response.data.items.map(item => ({
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
        alert("Erro ao carregar medições.");
      }
    };

    fetchMedicoes();
  }, [navigate]);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
