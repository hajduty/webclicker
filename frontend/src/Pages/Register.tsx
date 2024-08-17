import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API_URL } from '../Utils/Requests';

interface LoginRequest {
    email: string;
    password: string;
}

export const Register: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const { authenticated } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate("/combat");
        }
      }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const request: LoginRequest = { email, password };

        try {
            const response = await axios.post(`${API_URL}/Auth/register`, request);
            console.log(response);
            login(response.data.token, response.data.user);
            navigate('/combat');
        } catch (error) {
            console.error('Login failed', error);
            setError(true);
        }
    };

    return (
        <div className='flex flex-col md:flex-row items-center justify-center min-h-screen text-[#7f0606] overflow-hidden gap-4 md:gap-0'>
            <div className="w-80 md:h-96 h-50 bg-[#0a0a0a] p-4 rounded-l-sm">
                <h1 className='text-start text-5xl'>Cure Client</h1>
                <h2 className='text-start text-xl'>Web Console</h2>
            </div>
            <div className="w-80 h-80 md:h-96 bg-[#0e0e0e] p-4 flex flex-col justify-center gap-6 items-center rounded md:rounded-r-lg md:rounded-none">
                <h1 className="text-2xl text-gray-400">Register</h1>
                <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 rounded-sm bg-[#222222] text-white"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 rounded-sm bg-[#222222] text-white"
                    />
                    <button type="submit" className="p-2 bg-red-900 rounded hover:bg-red-950 text-black">
                        Register
                    </button>
                    {error && <>
                        <p className="text-center text-gray-500">Error, e-mail already in use.</p>
                    </>}
                </form>
                <span className='text-start flex column space-x-2'>
                        <p className="text-gray-400">Already registered?</p>
                        <Link to="/">
                            <p className='underline'>Login</p>
                        </Link>
                    </span>
            </div>
        </div>
    );
};