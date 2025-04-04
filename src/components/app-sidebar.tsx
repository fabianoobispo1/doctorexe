'use client'
import {
  ChevronDown,
  ChevronUp,
  Home,
  Settings,
  UserPen,
  NotebookPenIcon,
  Users,
  Dumbbell,
  Mail,
  FileCheckIcon,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Skeleton } from './ui/skeleton'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Lista de tarefas',
    url: '/dashboard/lista',
    icon: NotebookPenIcon,
  },
  {
    title: 'Perfil',
    url: '/dashboard/perfil',
    icon: UserPen,
  },
  {
    title: 'Seus arquivos',
    url: '/dashboard/arquivos',
    icon: FileCheckIcon,
  },
]
const itemsAdm = [
  {
    title: 'Administração',
    url: '/dashboard/admin',
    icon: Settings,
  },
  {
    title: 'Pacientes',
    url: '/dashboard/pacientes',
    icon: Users,
  },
  {
    title: 'Exercícios',
    url: '/dashboard/exercicios',
    icon: Dumbbell,
  },

  {
    title: 'Fale conosco',
    url: '/dashboard/fale-conosco',
    icon: Mail,
  },
  {
    title: 'Adicionar arquivos',
    url: '/dashboard/arquivosupload',
    icon: FileCheckIcon,
  },
]

export function AppSidebar() {
  const { data: session } = useSession()
  const { open } = useSidebar()
  const [isAdmin, setIsAdmin] = useState(false)
  const [carregou, setiscarregou] = useState(false)
  if (session) {
    if (!carregou) {
      if (session.user.role === 'admin') {
        setIsAdmin(true)
      }
      setiscarregou(true)
    }
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Doctor exe</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger disabled={!isAdmin}>
                      Administração
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {itemsAdm.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {!session ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[100px]" />
                    </>
                  ) : (
                    <>
                      <Avatar className={cn(open ? ' h-8 w-8 ' : ' h-6 w-6 ')}>
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.nome}
                        />
                        <AvatarFallback>{session.user.nome[0]}</AvatarFallback>
                      </Avatar>
                      {session.user.nome}
                    </>
                  )}

                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <a href={'/dashboard/perfil'}>
                  <DropdownMenuItem>
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </a>
                <DropdownMenuItem onClick={() => signOut()}>
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
