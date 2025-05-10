import { useState } from 'react'
import InputField from '../components/InputField'
import {useNavigate} from 'react-router-dom';
import { PrimaryButton, CreateAccountButton } from '../components/PrimaryButton'


export default function CadastroUsuario() {
    const [formData, setFormData] = useState({
        usuario: '',
        senha: '',
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Usuário cadastrado:', formData)
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <InputField
                    label="Usuario"
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                />
                <InputField
                    label="Senha"
                    type="password"
                    name="senha"
                    value={formData.usuario}
                    onChange={handleChange}
                />
                <PrimaryButton type="submit">Cadastrar</PrimaryButton>
                <CreateAccountButton onClick={() => navigate('/')} texto1="Já possui uma conta?" texto2="Entrar"/>
            </form>
        </div>
        </div>
    )
}
