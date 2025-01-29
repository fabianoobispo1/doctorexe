'use client'

import { useRef } from 'react'
import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatPhoneNumber } from '@/lib/utils'

interface PrintAvaliacaoProps {
  avaliacao: {
    dataAvaliacao: string
    nome: string
    dataNascimento: string
    telefone: string
    altura: number
    peso: number
    pressaoArterial: string
    frequenciaCardiaca: number
    historiaClinica: string
    apresentacaoPaciente: {
      deambulando: boolean
      deambulandoComApoio: boolean
      cadeiraRodas: boolean
      internado: boolean
      orientado: boolean
    }
  }
}

export function PrintAvaliacao({ avaliacao }: PrintAvaliacaoProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = contentRef.current
    if (!printContent) return

    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Avaliação Física - ${avaliacao.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .label { font-weight: bold; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <>
      <Button onClick={handlePrint} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>

      <div ref={contentRef} className="hidden">
        <div className="header">
          <h1>Avaliação Física</h1>
          <p>
            Data:{' '}
            {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="section">
          <div className="section-title">Dados do Paciente</div>
          <div className="grid">
            <div>
              <span className="label">Nome:</span> {avaliacao.nome}
            </div>
            <div>
              <span className="label">Data de Nascimento:</span>{' '}
              {new Date(avaliacao.dataNascimento).toLocaleDateString('pt-BR')}
            </div>
            <div>
              <span className="label">Telefone:</span>{' '}
              {formatPhoneNumber(avaliacao.telefone)}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Dados Clínicos</div>
          <div className="grid">
            <div>
              <span className="label">Altura:</span> {avaliacao.altura}m
            </div>
            <div>
              <span className="label">Peso:</span> {avaliacao.peso}kg
            </div>
            <div>
              <span className="label">Pressão Arterial:</span>{' '}
              {avaliacao.pressaoArterial}
            </div>
            <div>
              <span className="label">Frequência Cardíaca:</span>{' '}
              {avaliacao.frequenciaCardiaca} bpm
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">História Clínica</div>
          <p>{avaliacao.historiaClinica}</p>
        </div>

        <div className="section">
          <div className="section-title">Apresentação do Paciente</div>
          <div className="grid">
            {Object.entries(avaliacao.apresentacaoPaciente).map(
              ([key, value]) => (
                <div key={key}>
                  <span className="label">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>{' '}
                  {value ? 'Sim' : 'Não'}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  )
}
