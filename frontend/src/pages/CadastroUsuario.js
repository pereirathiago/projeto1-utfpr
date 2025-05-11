import { useState } from 'react'
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/users', formData)
      console.log('Usuário cadastrado com sucesso:', response.data)
      alert('Usuário cadastrado com sucesso!')
      navigate('/login') // Redireciona para o login
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.')
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
