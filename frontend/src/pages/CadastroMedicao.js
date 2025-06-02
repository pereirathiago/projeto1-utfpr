import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
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

    const [mostrarImportBox, setMostrarImportBox] = useState(false);
    const inputFileRef = useRef(null);

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
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
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
                dataHora: formData.dataHora.replace('T', ' '),
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
            navigate('/home')
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao importar o arquivo.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cadastro de Medição</h2>
                <div className="relative w-full md:w-auto">
                    <button
                        onClick={() => setMostrarImportBox(prev => !prev)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
                    >
                        Importar
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
                                Enviar modelo preenchido
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="comodo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cômodo
                    </label>
                    {comodos.length > 0 ? (
                        <select
                            id="comodo"
                            name="comodo"
                            value={formData.comodo}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
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
                            id="comodo_disabled" // ID diferente se 'comodo' for usado no select
                            type="text"
                            disabled
                            value="Nenhum cômodo cadastrado"
                            className="border p-2 rounded bg-gray-100 text-gray-500 w-full"
                        />
                    )}
                </div>
                <div>
                    <label htmlFor="sinal24" className="block text-sm font-medium text-gray-700 mb-1">
                        Sinal 2.4 GHz (dBm)
                    </label>
                    <input
                        id="sinal24"
                        name="sinal24"
                        placeholder="-50"
                        value={formData.sinal24}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        max="0"
                    />
                </div>
                <div>
                    <label htmlFor="sinal5" className="block text-sm font-medium text-gray-700 mb-1">
                        Sinal 5 GHz (dBm)
                    </label>
                    <input
                        id="sinal5"
                        name="sinal5"
                        placeholder="-55"
                        value={formData.sinal5}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        max="0"
                    />
                </div>
                <div>
                    <label htmlFor="velocidade24" className="block text-sm font-medium text-gray-700 mb-1">
                        Velocidade 2.4 GHz (Mbps)
                    </label>
                    <input
                        id="velocidade24"
                        name="velocidade24"
                        placeholder="70"
                        value={formData.velocidade24}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        step="0.1"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="velocidade5" className="block text-sm font-medium text-gray-700 mb-1">
                        Velocidade 5 GHz (Mbps)
                    </label>
                    <input
                        id="velocidade5"
                        name="velocidade5"
                        placeholder="350"
                        value={formData.velocidade5}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        step="0.1"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="interferencia" className="block text-sm font-medium text-gray-700 mb-1">
                        Interferência (dBm)
                    </label>
                    <input
                        id="interferencia"
                        name="interferencia"
                        placeholder="-90"
                        value={formData.interferencia}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        max="0"
                    />
                </div>
                <div className="md:col-span-2"> 
                    <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700 mb-1">
                        Data e Hora
                    </label>
                    <input
                        type="datetime-local"
                        id="dataHora"
                        name="dataHora"
                        value={formData.dataHora}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 justify-self-end col-span-full"
                    disabled={comodos.length === 0}
                >
                    Cadastrar Medição
                </button>
            </form>
        </div >
    );
}
