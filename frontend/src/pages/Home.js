function Home() {
  // Dados fictícios para teste
  const dados = [
    {
      comodo: 'Sala',
      sinal24: -60,
      sinal5: -65,
      velocidade24: 45.2,
      velocidade5: 120.3,
      interferencia: -80,
      dataHora: '2025-05-09 14:32',
    },
    {
      comodo: 'Quarto',
      sinal24: -70,
      sinal5: -68,
      velocidade24: 30.5,
      velocidade5: 90.7,
      interferencia: -75,
      dataHora: '2025-05-09 14:40',
    },
  ];

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
