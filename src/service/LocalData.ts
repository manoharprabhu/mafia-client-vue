export class LocalData {
  private static instance: LocalData
  public static readonly PLAYERID: string = "playerId"
  public static readonly LOBBYID: string = "lobbyId"
  public static readonly IP: string = "ip"

  public static getInstance(): LocalData {
    if (!LocalData.instance) {
      LocalData.instance = new LocalData()
    }

    return LocalData.instance
  }

  public setData(key: string, value: number | string | boolean) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public getData<T>(key: string): T | null  {
    const item = localStorage.getItem(key)
    if(!item) {
      return null
    }

    return JSON.parse(item)
  }

}