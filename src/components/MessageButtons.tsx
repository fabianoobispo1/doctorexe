import { useState } from 'react'
import axios from 'axios'
import { MessageCircleMore, MailPlusIcon } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { formatPhone, formatWhatsAppNumber } from '@/lib/utils'

interface MessageButtonsProps {
  recipient: {
    nome: string
    email: string
    celular: string
  }
  whatsappStatus: string
  nomeConectado: string
  numeroConectado: string
  loading: boolean
}

export function MessageButtons({
  recipient,
  whatsappStatus,
  nomeConectado,
  numeroConectado,
  loading,
}: MessageButtonsProps) {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendWhatsApp = async () => {
    setIsLoading(true)
    try {
      await axios.post('/api/whatsapp/sendMessage', {
        chatId: formatWhatsAppNumber(recipient.celular),
        contentType: 'string',
        content: whatsappMessage,
      })
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
    }
    setIsLoading(false)
    setIsWhatsAppModalOpen(false)
    setWhatsappMessage('')
  }

  const handleSendEmail = async () => {
    setIsLoading(true)
    try {
      await axios.post('/api/send', {
        email: recipient.email,
        conteudo: emailMessage,
        tipoMensagem: 'seletiva',
      })
    } catch (error) {
      console.error('Error sending email:', error)
    }
    setIsLoading(false)
    setIsEmailModalOpen(false)
    setEmailMessage('')
  }

  return (
    <>
      <div className="flex justify-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LoadingButton
                loading={loading}
                disabled={whatsappStatus !== 'session_connected'}
                onClick={() => setIsWhatsAppModalOpen(true)}
              >
                <MessageCircleMore className="h-4 w-4" />
              </LoadingButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar WhatsApp</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <LoadingButton
                loading={loading}
                onClick={() => setIsEmailModalOpen(true)}
              >
                <MailPlusIcon className="h-4 w-4" />
              </LoadingButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar Email</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={isWhatsAppModalOpen} onOpenChange={setIsWhatsAppModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar mensagem para {recipient.nome}</DialogTitle>
            <DialogDescription>
              Digite a mensagem que será enviada via WhatsApp do{' '}
              {nomeConectado === '' ? '-' : nomeConectado}
              {' - '}
              {numeroConectado === '' ? '-' : formatPhone(numeroConectado)}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWhatsAppModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              disabled={!whatsappMessage || isLoading}
            >
              Enviar WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar email para {recipient.nome}</DialogTitle>
            <DialogDescription>
              Digite a mensagem que será enviada via email para{' '}
              {recipient.email}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={!emailMessage || isLoading}
            >
              Enviar Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
