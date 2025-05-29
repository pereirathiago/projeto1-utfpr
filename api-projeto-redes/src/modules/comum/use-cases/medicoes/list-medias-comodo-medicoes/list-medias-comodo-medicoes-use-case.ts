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
      mediaSinal2_4ghz: parseFloat(row.mediaSinal2_4ghz),
      mediaSinal5ghz: parseFloat(row.mediaSinal5ghz),
      mediaVelocidade2_4ghz: parseFloat(row.mediaVelocidade2_4ghz),
      mediaVelocidade5ghz: parseFloat(row.mediaVelocidade5ghz),
      mediaInterferencia: parseFloat(row.mediaInterferencia)
    }));

    return {
      statusCode: 200,
      medias
    };
  }
}

export { ListMediaComodosMedicoesUseCase };
