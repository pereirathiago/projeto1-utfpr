import { injectable } from 'tsyringe'
import ExcelJS from 'exceljs'

@injectable()
class GetMedicoesModeloUseCase {
  private getModeloData() {
    return {
      headers: [
        { header: 'Nome do Cômodo (Ex: "Sala", "Quarto 1")', key: 'comodo' },
        { header: 'Data/Hora (YYYY-MM-DDTHH:MM:SS)', key: 'dataHora' },
        { header: 'Sinal 2.4GHz (dBm, ex: -50)', key: 'nivelSinal2_4ghz' },
        { header: 'Sinal 5GHz (dBm, ex: -45)', key: 'nivelSinal5ghz' },
        { header: 'Velocidade 2.4GHz (Mbps)', key: 'velocidade2_4ghz' },
        { header: 'Velocidade 5GHz (Mbps)', key: 'velocidade5ghz' },
        { header: 'Interferência', key: 'interferencia' }
      ],
      exampleRow: {
        comodo: 'Sala',
        dataHora: new Date().toISOString(),
        nivelSinal2_4ghz: -50,
        nivelSinal5ghz: -45,
        velocidade2_4ghz: 75.5,
        velocidade5ghz: 150.2,
        interferencia: 30
      }
    }
  }

  async getCSVModelo(): Promise<string> {
    const { headers, exampleRow } = this.getModeloData()
    
    const csvHeaders = headers.map(h => h.header).join(',')
    const csvRow = Object.values(exampleRow).join(',')
    
    return [
      '# Modelo para cadastro de medições',
      '# Substitua os valores abaixo pelos reais',
      csvHeaders,
      csvRow
    ].join('\n')
  }

  async getXLSXModelo(): Promise<ExcelJS.Buffer> {
    const { headers, exampleRow } = this.getModeloData()
    
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Medições')
    
    worksheet.columns = headers
    
    worksheet.addRow(exampleRow)
    
    worksheet.getRow(1).font = { bold: true }
    worksheet.columns.forEach(column => {
      column.width = Math.max(20, column.header!.length + 2)
    })
    
    worksheet.getCell('A1').note = 'Modelo para cadastro de medições\nSubstitua os valores pelos reais'
    
    return await workbook.xlsx.writeBuffer()
  }

  async execute(format: 'csv' | 'xlsx') {
    if (format === 'xlsx') {
      return {
        type: 'xlsx',
        data: await this.getXLSXModelo()
      }
    }
    return {
      type: 'csv',
      data: await this.getCSVModelo()
    }
  }
}

export { GetMedicoesModeloUseCase }