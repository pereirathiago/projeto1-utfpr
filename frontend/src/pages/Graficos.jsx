import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer
} from 'recharts';

export default function Graficos() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/medias`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.medias) {
          setDados(response.data.medias)
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedias()
  }, [])

  if (loading) {
    return <div className="text-center mt-8 text-gray-600">Carregando gráficos...</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">Resultado do nível de sinal (dbm)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dados}>
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
            <BarChart data={dados}>
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
  )
}
