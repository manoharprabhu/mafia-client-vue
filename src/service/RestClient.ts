import axios, { Axios } from 'axios'
export class RestClient {
  private static instance: RestClient
  private root: string = 'http://localhost:8080'
  private client: Axios | undefined

  public static getInstance() {
    if (RestClient.instance) {
      return RestClient.instance
    }

    RestClient.instance = new RestClient()
    RestClient.instance.client = axios.create({
      baseURL: RestClient.instance.root,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar',
      },
    })

    return RestClient.instance
  }

  public async createGame(playerName: string): Promise<HTTPResponse<CreateGameResponse>> {
    const request = await this.client?.post<HTTPResponse<CreateGameResponse>>(
      `${this.root}/lobby/create`,
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
      `${this.root}/lobby/join`,
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
      `${this.root}/lobby/get`,
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
  players: [
    { playerId: string, playerName: string }
  ]
}