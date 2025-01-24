'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { avaliacaoFisioSchema } from '@/lib/schemas/avaliacao-fisio-schema'
import { AvaliacaoFisio } from '@/types/avaliacaoFisio'
import { FileUploader } from '@/components/file-uploader'
import { api } from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AvaliacaoFormProps {
  avaliacaoId?: string
  initialData?: AvaliacaoFisio
}

export function AvaliacaoForm({
  avaliacaoId,
  initialData,
}: AvaliacaoFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(avaliacaoFisioSchema),
    defaultValues: initialData || {
      nome: '',
      dataAvaliacao: new Date(),
      dataNascimento: new Date(),
      telefone: '',
      sexo: '',
      cidade: '',
      bairro: '',
      profissao: '',
      enderecoResidencial: '',
      enderecoComercial: '',
      naturalidade: '',
      estadoCivil: '',
      diagnosticoClinico: '',
      diagnosticoFisioterapeutico: '',

      historiaClinica: '',
      queixaPrincipal: '',
      habitosVida: '',
      hma: '',
      hmp: '',
      antecedentePessoal: '',
      antecedenteFamiliar: '',
      tratamentosRealizados: '',
      altura: 0,
      peso: 0,
      pressaoArterial: '',
      frequenciaCardiaca: 0,

      apresentacaoPaciente: {
        deambulando: false,
        deambulandoComApoio: false,
        cadeiraRodas: false,
        internado: false,
        orientado: false,
      },

      examesComplementares: {
        possui: false,
        descricao: '',
        imagens: [],
      },

      medicamentos: {
        usa: false,
        descricao: '',
      },

      cirurgias: {
        realizou: false,
        descricao: '',
      },

      inspecaoPalpacao: {
        normal: false,
        edema: false,
        cicatrizacaoIncompleta: false,
        eritemas: false,
        outros: '',
      },

      semiologia: '',
      testesEspecificos: '',
      escalaEva: 0,

      objetivosTratamento: '',
      recursosTerapeuticos: '',
      planoTratamento: '',
      evolucoes: [],
    },
  })

  async function onSubmit(data: AvaliacaoFisio) {
    try {
      if (avaliacaoId) {
        await api.put(`/doctorexe/avaliacaofisio/${avaliacaoId}`, data)
      } else {
        await api.post('/doctorexe/avaliacaofisio/register', data)
      }

      toast({
        title: 'Sucesso',
        description: `Avaliação ${avaliacaoId ? 'atualizada' : 'cadastrada'} com sucesso!`,
      })

      router.push('/dashboard/avaliacoes')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a avaliação',
        variant: 'destructive',
      })
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-150px)] w-full pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Seção 1 - Identificação */}
          <Card>
            <CardHeader>
              <CardTitle>1. Identificação do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split('T')[0]
                              : ''
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enderecoResidencial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Residencial</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enderecoComercial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Comercial</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="naturalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naturalidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estadoCivil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção 2 - Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle>2. Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="historiaClinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>História Clínica</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queixaPrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queixa Principal</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="habitosVida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hábitos de Vida</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="altura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (m)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pressaoArterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pressão Arterial</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequenciaCardiaca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência Cardíaca</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção 3 - Exame Clínico */}
          <Card>
            <CardHeader>
              <CardTitle>3. Exame Clínico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="apresentacaoPaciente.deambulando"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Deambulando</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apresentacaoPaciente.deambulandoComApoio"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Deambulando com Apoio</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apresentacaoPaciente.cadeiraRodas"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Cadeira de Rodas</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apresentacaoPaciente.internado"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Internado</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apresentacaoPaciente.orientado"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Orientado</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="examesComplementares.possui"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Possui Exames Complementares</FormLabel>
                    </FormItem>
                  )}
                />

                {form.watch('examesComplementares.possui') && (
                  <>
                    <FormField
                      control={form.control}
                      name="examesComplementares.descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição dos Exames</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="examesComplementares.imagens"
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagens dos Exames</FormLabel>
                          <FormControl>
                            <FileUploader
                              accept={{ 'image/*': [] }}
                              maxFileCount={5}
                              onUpload={async (files) => {
                                console.log(files)
                                // Implementar lógica de upload
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="semiologia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semiologia</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testesEspecificos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testes Específicos</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escalaEva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escala EVA (0-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção 4 - Plano Terapêutico */}
          <Card>
            <CardHeader>
              <CardTitle>4. Plano Terapêutico</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="objetivosTratamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivos do Tratamento</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recursosTerapeuticos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recursos Terapêuticos</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planoTratamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano de Tratamento</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit">
              {avaliacaoId ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
