import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository';
import { inject, injectable } from 'tsyringe';

interface MediaComodoDTO {
  nomeComodo: string;
  mediaSinal2_4ghz: number;
  mediaSinal5ghz: number;
  mediaVelocidade2_4ghz: number;
  mediaVelocidade5ghz: number;
  mediaInterferencia: number;
}

interface ResponseProps {
  statusCode: number,
  medias: MediaComodoDTO[]
}

@injectable()
class ListMediaComodosMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
  private medicoesRepository: IMedicoesRepository
  ) { }

  async execute(userId: string): Promise<ResponseProps> {
    const resultado = await this.medicoesRepository.listMediaByComodo(userId);

    if (resultado.statusCode !== 200) {
      return {
        statusCode: resultado.statusCode,
        medias: []
      };
    }

    const medias = resultado.data.map((row: any) => ({
      nomeComodo: row.nomeComodo,
      mediaSinal2_4ghz: parseFloat(row.mediaSinal2_4ghz).toFixed(1),
      mediaSinal5ghz: parseFloat(row.mediaSinal5ghz).toFixed(1),
      mediaVelocidade2_4ghz: parseFloat(row.mediaVelocidade2_4ghz).toFixed(1),
      mediaVelocidade5ghz: parseFloat(row.mediaVelocidade5ghz).toFixed(1),
      mediaInterferencia: parseFloat(row.mediaInterferencia).toFixed(1)
    }));

    return {
      statusCode: 200,
      medias
    };
  }
}

export { ListMediaComodosMedicoesUseCase };
