import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import axios from "axios";

export default function CadastroComodo() {
    const [formData, setFormData] = useState({ nome: '' });
    const [comodos, setComodos] = useState([]);
    const [page] = useState(1); // Você pode adicionar paginação depois, se quiser
    const [pageSize] = useState(20);

    const token = localStorage.getItem('token');

    const fetchComodos = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/comodos/list`,
                {
                    search: '',
                    page,
                    pageSize,
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
            alert('Erro ao buscar cômodos.');
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
            await axios.post(
                `${process.env.REACT_APP_API_URL}/comodos`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Cômodo cadastrado com sucesso!');
            setFormData({ nome: '' }); // limpa o formulário
            fetchComodos(); // atualiza a lista
        } catch (error) {
            console.error('Erro ao cadastrar cômodo:', error);
            alert('Erro ao cadastrar cômodo. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-6">Cadastro de Cômodo</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    name="nome"
                    placeholder="Nome do Cômodo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <PrimaryButton type="submit">Cadastrar</PrimaryButton>
            </form>

            <h3 className="text-lg font-semibold mb-4 text-black-600 border-b-2 border-black-300 pb-2">
                Cômodos cadastrados:
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
                {comodos.length === 0 ? (
                    <p className="text-gray-500">Nenhum cômodo cadastrado.</p>
                ) : (
                    comodos.map((comodo) => (
                        <li key={comodo.id} className="text-gray-800 hover:text-blue-500 transition-colors">
                            {comodo.nome}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
