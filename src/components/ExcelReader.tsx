import { ChangeEvent, useState } from 'react'
import * as XLSX from 'xlsx'
/* import { fetchMutation } from 'convex/nextjs' */

import { Button } from '@/components/ui/button'

/* import { api } from '../../convex/_generated/api' */

export const ExcelReader = () => {
  const [fileName, setFileName] = useState<string>('')

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = async (event) => {
      const data = event.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Log the keys of the first row to see column names
      if (jsonData.length > 0) {
        /* console.log('Column headers:', Object.keys(jsonData[0])) */
      }

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i]
        console.log(`Row ${i + 1}:`, row)
        /* console.log('Data Registro:', row['Data Registro'])

        const excelDateToJSDate = (excelDate: number) => {
          return (excelDate - 25569) * 86400 * 1000
        }
        const dataNascimento = excelDateToJSDate(row['Data Nascimento'])
        const DataRegistro = excelDateToJSDate(row['Data Registro'])

        const cpfSemMascara = row.CPF ? row.CPF.replace(/\D/g, '') : ''
        const celularSemMascara = row.Telefone
          ? row.Telefone.replace(/\D/g, '')
          : ''

        await fetchMutation(api.atletas.create, {
          bairro: row.Bairro ?? '',
          celular: celularSemMascara,
          cep: row.Cep ?? '',
          cidade: row.Cidade ?? '',
          cpf: cpfSemMascara,
          email: row.Email,
          emisor: row['Orgão Emissor'] ?? '',
          nome: row['Nome Civil'],
          rg: row.RG,
          rua: row.Rua ?? '',
          uf: row.UF ?? '',
          uf_emisor: row['UF Emissor'] ?? '',
          data_nascimento: dataNascimento,
          data_registro: DataRegistro,
          altura: 0,
          peso: 0,
          posicao: '',
          setor: 0,
          status: 1,
          genero: 'M',
          complemento: '',
          img_link: '',
        }) */
      }
    }

    reader.readAsBinaryString(file)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
          id="excel-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('excel-upload')?.click()}
        >
          Selecionar arquivo Excel
        </Button>
        {fileName && <span>Arquivo selecionado: {fileName}</span>}
      </div>
    </div>
  )
}
