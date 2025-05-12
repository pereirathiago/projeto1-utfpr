import { useEffect, useState } from 'react'
import InputField from '../components/InputField'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton, CreateAccountButton } from '../components/PrimaryButton'
import axios from 'axios'

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          navigate('/home'); // Token válido, redireciona
        })
        .catch((err) => {
          console.warn('Token inválido ou expirado:', err);
          // token inválido, remove do localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, formData)
      console.log('Usuário cadastrado com sucesso:', response.data)
      alert('Usuário cadastrado com sucesso!')
      navigate('/') // Redireciona para o login
    } catch (error) {
      switch (error.response?.status) {
        case 400:
          alert('Erro: Dados inválidos. Verifique os campos e tente novamente.')
          break
        case 409:
          alert('Erro: Email já cadastrado.')
          break
        default:
          alert('Erro ao cadastrar usuário. Tente novamente mais tarde.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Usuário</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <InputField
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <PrimaryButton type="submit">Cadastrar</PrimaryButton>
          <CreateAccountButton onClick={() => navigate('/')} texto1="Já possui uma conta?" texto2="Entrar" />
        </form>
      </div>
    </div>
  )
}
