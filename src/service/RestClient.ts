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
}

export type HTTPResponse<T> = {
  success: boolean,
  message: string,
  data: T
}

export type CreateGameResponse = {
  playerId: string
}