import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-reponse.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ){}
  
  async executeSeed() {
    await this.pokemonModel.deleteMany({})

    const data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // const insertPromiseArray = [];

    // data.results.forEach(async ({name, url}) => {
    //   const segments =  url.split('/')
    //   const no: number =  +segments[ segments.length - 2]

    //   insertPromiseArray.push(
    //     this.pokemonModel.create( {name, no} )
    //   )
    // })
    
    // await Promise.all(insertPromiseArray);

    const pokemonToInsert: { name: string, no: number}[] = [];

    data.results.forEach(async ({name, url}) => {
      const segments =  url.split('/')
      const no: number =  +segments[ segments.length - 2]

      pokemonToInsert.push({name, no})
    })
    
    this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Execution'
  }
}
