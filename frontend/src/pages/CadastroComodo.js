import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import axios from "axios";
import Swal from 'sweetalert2';

export default function EdicaoComodo() {
    const [formData, setFormData] = useState({ nome: '', id: '' });
    const [comodos, setComodos] = useState([]);
    const [page] = useState(1);
    const [pageSize] = useState(20);
    const [isEditing, setIsEditing] = useState(false);

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
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao buscar cômodos.',
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
            if (isEditing) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/comodos/${formData.id}`,
                    { nome: formData.nome },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Cômodo atualizado com sucesso!'
                });
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/comodos`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Cômodo cadastrado com sucesso!'
                });
            }

            setFormData({ nome: '', id: '' });
            setIsEditing(false);
            fetchComodos();
        } catch (error) {
            console.error('Erro ao salvar cômodo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao salvar cômodo. Tente novamente mais tarde.'
            });
        }
    };

    const handleEdit = (comodo) => {
        setFormData({
            nome: comodo.nome,
            id: comodo.id
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ nome: '', id: '' });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-6">
                {isEditing ? 'Editar Cômodo' : 'Cadastro de Cômodo'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    name="nome"
                    placeholder="Nome do Cômodo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded col-span-2"
                />

                <div className="flex gap-2">
                    <PrimaryButton type="submit">
                        {isEditing ? 'Atualizar' : 'Cadastrar'}
                    </PrimaryButton>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h3 className="text-lg font-semibold mb-4 text-black-600 border-b-2 border-black-300 pb-2">
                Cômodos cadastrados:
            </h3>

            <ul className="space-y-2">
                {comodos.length === 0 ? (
                    <p className="text-gray-500">Nenhum cômodo cadastrado.</p>
                ) : (
                    comodos.map((comodo) => (
                        <li
                            key={comodo.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                            <span className="text-gray-800">{comodo.nome}</span>
                            <button
                                onClick={() => handleEdit(comodo)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Editar
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}