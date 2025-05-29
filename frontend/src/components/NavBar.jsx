// src/components/NavBar.js
import {
    Disclosure,
    DisclosureButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const navigation = [
        { name: 'Medições', href: '/home' },
        { name: 'Graficos', href: '/graficos' },
        { name: 'Cadastro de Medição', href: '/cadastromedicao' },
        { name: 'Cadastro de Cômodo', href: '/cadastrocomodo' },
    ];

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        axios.get('http://localhost:3333/users/profile', {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }).then(res => {
            setUser(res.data);
        }).catch(error => {
            console.error('Erro ao carregar dados do usuário');
            if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('refreshToken');
            navigate('/');
            }
        });
    }, [navigate]);

    const avatarUrl = user?.avatarUrl && user.avatarUrl !== '/avatar/null'
        ? `http://localhost:3333${user.avatarUrl}`
        : 'https://i.pinimg.com/1200x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg';

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
                            <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                alt="Your Company"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.href)}
                                        className={classNames(
                                            location.pathname === item.href
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium'
                                        )}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src={avatarUrl}
                                        alt="User avatar"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                                <MenuItem>
                                    <button
                                        onClick={() => navigate('/perfil')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Ver perfil
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </Disclosure>
    );
}
