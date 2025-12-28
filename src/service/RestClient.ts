import axios, { Axios } from 'axios'
import { LocalData } from '@/service/LocalData.ts'
export class RestClient {
  private static instance: RestClient | null = null
  private static root: string = 'http://localhost:8080'
  private client: Axios | undefined

  public static overrideHost(host: string) {
    RestClient.root = host
    RestClient.instance = null
    // refresh
    RestClient.getInstance()
  }

  public static getInstance() {
    if (RestClient.instance) {
      return RestClient.instance
    }

    const storedIp = LocalData.getInstance().getData<string>(LocalData.IP)
    if(storedIp !== null) {
      RestClient.root = storedIp
    }

    RestClient.instance = new RestClient()
    RestClient.instance.client = axios.create({
      baseURL: RestClient.root,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return RestClient.instance
  }

  public async createGame(playerName: string): Promise<HTTPResponse<CreateGameResponse>> {
    const request = await this.client?.post<HTTPResponse<CreateGameResponse>>(
      `${RestClient.root}/lobby/create`,
      {
        playerName,
      },
    )

    if(!request) {
      console.log('Error creating game')
      return Promise.reject("Error creating game")
    }

    if (request.status !== 200) {
      console.log('Error creating game, non 200 status')
      return Promise.reject("Error creating game, non 200 status")
    }

    return request.data
  }

  public async joinGame(lobbyId: String, playerName: String): Promise<HTTPResponse<JoinGameResponse>> {
    const request = await this.client?.post<HTTPResponse<JoinGameResponse>>(
      `${RestClient.root}/lobby/join`,
      {
        playerName,
        lobbyId
      },
    )

    if (!request) {
      console.log('Error joining game')
      return Promise.reject('Error joining game')
    }

    if (request.status !== 200) {
      console.log('Error joining game, non 200 status')
      return Promise.reject('Error joining game, non 200 status')
    }

    return request.data
  }

  public async getLobby(lobbyId: string, playerId: string): Promise<HTTPResponse<GetLobbyResponse>> {
    const request = await this.client?.post<HTTPResponse<GetLobbyResponse>>(
      `${RestClient.root}/lobby/get`,
      {
        lobbyId,
        playerId,
      },
    )

    if (!request) {
      console.log('Error getting lobby')
      return Promise.reject('Error getting lobby')
    }

    if (request.status !== 200) {
      console.log('Error getting lobby, non 200 status')
      return Promise.reject('Error getting lobby, non 200 status')
    }

    return request.data
  }
}

export type HTTPResponse<T> = {
  success: boolean,
  message: string,
  data: T
}

export type CreateGameResponse = {
  playerId: string,
  lobbyId: string
}

export type JoinGameResponse = {
  playerId: string
}

export type GetLobbyResponse = {
  lobbyCreatorId: string
  currentPhase: string
  players: [{ playerId: string; playerName: string }]
}