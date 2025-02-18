import { CheckIcon, XIcon } from 'lucide-react'

export function RoadmapContent() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Autenticação & Gestão de Usuários
        </h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Autenticação básica com credenciais</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Gerenciamento de perfil de usuário</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Login social (Google, apple)</span>
          </li>

          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Sistema de recuperação de senha</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Verificação de email</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Funcionalidades Principais</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Layout do Dashboard</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Implementação de papéis de usuário</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Sistema de agendamento</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Gestão de prontuários</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Sistema de faturamento</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Melhorias Técnicas</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Implementação Next.js 14</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Integração TypeScript</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <span>Estilização com Tailwind CSS</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Otimização de performance</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Suite de testes completa</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Desenvolvimentos Futuros</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Notificações em tempo real</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Integração com calendário</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Dashboard de análises</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Suporte a múltiplos idiomas</span>
          </li>
          <li className="flex items-center gap-2">
            <XIcon className="h-5 w-5 text-red-500" />
            <span>Alternância tema claro/escuro</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
