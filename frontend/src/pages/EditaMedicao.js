import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from "react-router-dom";

export default function Edita() {
    const [formData, setFormData] = useState({
        comodo: '',
        sinal24: '',
        sinal5: '',
        velocidade24: '',
        velocidade5: '',
        interferencia: '',
        dataHora: '',
    });

    const [comodos, setComodos] = useState([]);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();
    const medicaoId = location.state?.id;

    // 1. Buscar os cômodos
    const fetchComodos = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/comodos/list`,
                {
                    search: '',
                    page: 1,
                    pageSize: 10000,
                    order: 'nome',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComodos(response.data.items);
        } catch (error) {
            console.error('Erro ao buscar cômodos:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao carregar os cômodos.',
                icon: 'error',
            });
        }
    };

    // 2. Buscar os dados da medição pelo ID
    const fetchMedicao = async () => {
        if (!medicaoId) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/medicoes/${medicaoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data;
            setFormData({
                comodo: data.comodoId,
                sinal24: data.nivelSinal2_4ghz,
                sinal5: data.nivelSinal5ghz,
                velocidade24: data.velocidade2_4ghz,
                velocidade5: data.velocidade5ghz,
                interferencia: data.interferencia,
                dataHora: new Date(data.dataHora).toISOString().slice(0, 16), // Formato para input datetime-local
            });
        } catch (error) {
            console.error('Erro ao buscar medição:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao carregar dados da medição.',
                icon: 'error',
            });
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        fetchComodos();
        fetchMedicao();
    }, [medicaoId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 3. Atualizar a medição existente
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                comodoId: formData.comodo,
                dataHora: formData.dataHora.replace('T', ' '),
                nivelSinal2_4ghz: parseInt(formData.sinal24),
                nivelSinal5ghz: parseInt(formData.sinal5),
                velocidade2_4ghz: parseFloat(formData.velocidade24),
                velocidade5ghz: parseFloat(formData.velocidade5),
                interferencia: parseInt(formData.interferencia),
            };

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/medicoes/${medicaoId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                title: 'Sucesso',
                text: 'Medição atualizada com sucesso!',
                icon: 'success',
            }).then(() => {
                navigate('/home'); // Volta para a listagem
            });
        } catch (error) {
            console.error('Erro ao atualizar medição:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao atualizar medição.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-6">Editar Medição</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                    name="comodo"
                    value={formData.comodo}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                >
                    <option value="">Selecione um cômodo</option>
                    {comodos.map((comodo) => (
                        <option key={comodo.id} value={comodo.id}>
                            {comodo.nome}
                        </option>
                    ))}
                </select>

                <input name="sinal24" placeholder="Sinal 2.4 GHz (dBm)" value={formData.sinal24} onChange={handleChange} required className="border p-2 rounded" type="number" />
                <input name="sinal5" placeholder="Sinal 5 GHz (dBm)" value={formData.sinal5} onChange={handleChange} required className="border p-2 rounded" type="number" />
                <input name="velocidade24" placeholder="Velocidade 2.4 GHz (Mbps)" value={formData.velocidade24} onChange={handleChange} required className="border p-2 rounded" type="number" step="1" />
                <input name="velocidade5" placeholder="Velocidade 5 GHz (Mbps)" value={formData.velocidade5} onChange={handleChange} required className="border p-2 rounded" type="number" step="1" />
                <input name="interferencia" placeholder="Interferência (dBm)" value={formData.interferencia} onChange={handleChange} required className="border p-2 rounded" type="number" />
                <input type="datetime-local" name="dataHora" value={formData.dataHora} onChange={handleChange} required className="border p-2 rounded col-span-full" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 justify-self-end col-span-full">
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
}
