// Declarações de tipos para o Vimeo Player SDK
interface Window {
  Vimeo: {
    Player: new (iframe: HTMLIFrameElement) => VimeoPlayer
  }
}

interface VimeoPlayer {
  on(event: string, callback: (data?: any) => void): void
  off(event: string): void
  play(): Promise<void>
  pause(): Promise<void>
  getDuration(): Promise<number>
  getCurrentTime(): Promise<number>
}

