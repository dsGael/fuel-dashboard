import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, Fuel } from 'lucide-react';
import { getToken, login } from '../api/client';

const inputClass =
  'bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

export function LoginPage() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => login(correo, password),
    onSuccess: () => navigate('/', { replace: true }),
  });

  if (getToken()) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const error = mutation.error;
  const errorMessage =
    error &&
    ((isAxiosError(error) && error.response?.data?.message) || 'Correo o contraseña incorrectos');

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card border border-border rounded-xl p-6 space-y-5"
      >
        <div className="flex items-center justify-center gap-2">
          <Fuel className="h-6 w-6 text-accent-blue" />
          <span className="text-lg font-semibold">Fuel Dashboard</span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="correo" className="text-xs text-slate-400 mb-1">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
            autoFocus
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-xs text-slate-400 mb-1">Contraseña</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={`${inputClass} w-full pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-accent-red">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-md transition-colors"
        >
          {mutation.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
