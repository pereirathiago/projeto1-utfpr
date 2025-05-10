import { useState } from 'react'

export default function Cadastro() {
    const [formData, setFormData] = useState({
        comodo: '',
        sinal24: '',
        sinal5: '',
        velocidade24: '',
        velocidade5: '',
        interferencia: '',
        dataHora: '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Medição cadastrada:', formData)
        // Aqui você pode fazer um POST para a API
        alert('Medição cadastrada com sucesso!')
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-6">Cadastro de Medição</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="comodo"
                    placeholder="Cômodo"
                    value={formData.comodo}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    name="sinal24"
                    placeholder="Sinal 2.4 GHz (dBm)"
                    value={formData.sinal24}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    name="sinal5"
                    placeholder="Sinal 5 GHz (dBm)"
                    value={formData.sinal5}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    name="velocidade24"
                    placeholder="Velocidade 2.4 GHz (Mbps)"
                    value={formData.velocidade24}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    name="velocidade5"
                    placeholder="Velocidade 5 GHz (Mbps)"
                    value={formData.velocidade5}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    name="interferencia"
                    placeholder="Interferência (dBm)"
                    value={formData.interferencia}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
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
                    >
                        Cadastrar Medição
                    </button>
            </form>
        </div>
    )
}
