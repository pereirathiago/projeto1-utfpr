import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';

export default function Cadastro() {
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
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        fetchComodos();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                comodoId: formData.comodo,
                dataHora: formData.dataHora.replace('T', ' '), // Ajuste para formato da API
                nivelSinal2_4ghz: parseInt(formData.sinal24),
                nivelSinal5ghz: parseInt(formData.sinal5),
                velocidade2_4ghz: parseFloat(formData.velocidade24),
                velocidade5ghz: parseFloat(formData.velocidade5),
                interferencia: parseInt(formData.interferencia),
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/medicoes/`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Medição cadastrada:', response.data);
            Swal.fire({
                title: 'Sucesso',
                text: 'Medição cadastrada com sucesso!',
                icon: 'success'
            });

            // Opcional: limpar o formulário
            setFormData({
                comodo: '',
                sinal24: '',
                sinal5: '',
                velocidade24: '',
                velocidade5: '',
                interferencia: '',
                dataHora: '',
            });
        } catch (error) {
            console.error('Erro ao cadastrar medição:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao cadastrar medição. Verifique os dados e tente novamente.',
                icon: 'error'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-6">Cadastro de Medição</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comodos.length > 0 ? (
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
                ) : (
                    <input
                        type="text"
                        disabled
                        value="Nenhum cômodo cadastrado"
                        className="border p-2 rounded bg-gray-100 text-gray-500"
                    />
                )}

                <input
                    name="sinal24"
                    placeholder="Sinal 2.4 GHz (dBm)"
                    value={formData.sinal24}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                    type="number"
                />
                <input
                    name="sinal5"
                    placeholder="Sinal 5 GHz (dBm)"
                    value={formData.sinal5}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                    type="number"
                />
                <input
                    name="velocidade24"
                    placeholder="Velocidade 2.4 GHz (Mbps)"
                    value={formData.velocidade24}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                    type="number"
                    step="1"
                />
                <input
                    label="Velocidade 5 GHz (Mbps)"
                    name="velocidade5"
                    placeholder="Velocidade 5 GHz (Mbps)"
                    value={formData.velocidade5}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                    type="number"
                    step="1"
                />
                <input
                    name="interferencia"
                    placeholder="Interferência (dBm)"
                    value={formData.interferencia}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                    type="number"
                />
                <input
                    type="datetime-local"
                    name="dataHora"
                    value={formData.dataHora}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded col-span-full"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 justify-self-end col-span-full"
                    disabled={comodos.length === 0}
                >
                    Cadastrar Medição
                </button>
            </form>
        </div>
    );
}
