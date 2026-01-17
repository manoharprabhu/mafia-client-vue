import axios, { Axios } from 'axios'
import { LocalData } from '@/service/LocalData.ts'
export class RestClient {
  private static instance: RestClient | null = null
  //public static root: string = `${window.location.protocol}//${window.location.hostname}:8080`
  public static root: string = `https://mafia-server-rest.onrender.com/`
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

  public async votePlayer(
    lobbyId: string,
    playerId: string,
    targetPlayerId: string,
    type: 'villager' | 'mafia' | 'doctor',
  ): Promise<HTTPResponse<VotePlayerResponse>> {
    const request = await this.client?.post<HTTPResponse<VotePlayerResponse>>(
      `${RestClient.root}/game/vote`,
      {
        lobbyId,
        playerId,
        targetPlayerId,
        type,
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

  public async policeInspect(
    lobbyId: string,
    playerId: string,
    targetPlayerId: string,
  ): Promise<HTTPResponse<PoliceInspectResponse>> {
    const request = await this.client?.post<HTTPResponse<PoliceInspectResponse>>(
      `${RestClient.root}/game/police/inspect`,
      {
        lobbyId,
        playerId,
        targetPlayerId,
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

  public async sendMessage(lobbyId: string, playerId: string, message: string): Promise<void> {
    await this.client?.post<HTTPResponse<void>>(`${RestClient.root}/game/chat`, {
      lobbyId,
      playerId,
      message,
    })
  }

  public async skipDiscussion(lobbyId: string, playerId: string): Promise<void> {
    await this.client?.post<HTTPResponse<void>>(`${RestClient.root}/game/voteskip`, {
      lobbyId,
      playerId,
    })
  }
}


export type HTTPResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type CreateGameResponse = {
  playerId: string
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

export type VotePlayerResponse = {
  success: boolean
}

export type StartGameResponse = {
  status: string
}

export type PoliceInspectResponse = {
  success: boolean
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
    | 'WIN'
  dayNumber: number
  timeRemainingSeconds: number
  you: {
    playerId: string
    name: string
    role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
    alive: boolean
    hasSkippedDiscussion: boolean
  }
  players: [{ playerId: string; name: string; alive: boolean }]
  messages: [{ timestamp: number; message: string; type: number }]
  gameResult: string
  voteMap: { [key: string]: string }
  visibleRoles: {
    [key: string]: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
  }
  inspectionResults: [{ playerId: string; roleOrientation: 'GOOD' | 'BAD' }]
  yourHeadhunterTarget: string | undefined
  winner: 'VILLAGERS_WIN' | 'MAFIA_WIN' | 'HEADHUNTER_WIN' | 'FOOL_WIN' | 'NONE' | undefined
  hasInspectedAlready: boolean
  godFatherId: string | undefined
}
