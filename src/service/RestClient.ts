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
    if (storedIp !== null) {
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

    if (!request) {
      console.log('Error creating game')
      return Promise.reject('Error creating game')
    }

    if (request.status !== 200) {
      console.log('Error creating game, non 200 status')
      return Promise.reject('Error creating game, non 200 status')
    }

    return request.data
  }

  public async startGame(
    lobbyId: string,
    playerId: string,
  ): Promise<HTTPResponse<StartGameResponse>> {
    const request = await this.client?.post<HTTPResponse<StartGameResponse>>(
      `${RestClient.root}/game/start`,
      {
        lobbyId,
        playerId,
      },
    )

    if (!request) {
      console.log('Error creating game')
      return Promise.reject('Error creating game')
    }

    if (request.status !== 200) {
      console.log('Error creating game, non 200 status')
      return Promise.reject('Error creating game, non 200 status')
    }

    return request.data
  }

  public async joinGame(
    lobbyId: String,
    playerName: String,
  ): Promise<HTTPResponse<JoinGameResponse>> {
    const request = await this.client?.post<HTTPResponse<JoinGameResponse>>(
      `${RestClient.root}/lobby/join`,
      {
        playerName,
        lobbyId,
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

  public async getLobby(
    lobbyId: string,
    playerId: string,
  ): Promise<HTTPResponse<GetLobbyResponse>> {
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

  public async getGameState(
    lobbyId: string,
    playerId: string,
  ): Promise<HTTPResponse<GetGameResponse>> {
    const request = await this.client?.post<HTTPResponse<GetGameResponse>>(
      `${RestClient.root}/game/state`,
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

export type StartGameResponse = {
  status: string
}

export type GetGameResponse = {
  phase:
    | 'WAITING_FOR_PLAYERS'
    | 'START'
    | 'NIGHT'
    | 'RESOLVE_NIGHT'
    | 'DAY_DISCUSSION'
    | 'DAY_VOTING'
    | 'RESOLVE_DAY'
  dayNumber: number
  timeRemainingSeconds: number
  you: {
    playerId: string
    name: string
    role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
    alive: boolean
  }
  players: [{ playerId: string; name: string; alive: boolean }]
  messages: [{ timestamp: number; message: string }]
  gameResult: string
  voteMap: { [key: string]: string }
  visibleRoles: { [key: string]: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER' }
}