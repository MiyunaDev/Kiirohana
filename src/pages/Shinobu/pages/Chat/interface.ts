import { SeriesType } from "../../../../types/Series"

export interface ChatUser {
  id: string
  name: string
  role: string
  avatar: string
  nameColor?: string
  roleColor?: string
  isAdmin?: boolean
  isBot?: boolean
  status?: "online" | "idle" | "offline"
}

export type EmbedType =
  | "link"
  | "image"
  | "video"
  | "info"
  | "ai"
  | "code"
  | "file"
  | "event"
  | "warning"

export interface EmbedField {
  name: string
  value: string
}

export interface EmbedData {
  type: EmbedType
  title?: string
  description?: string
  url?: string
  image?: string
  siteName?: string
  thumbnail?: string
  fields?: EmbedField[]
  footer?: string
  accentColor?: string
  collapsible?: boolean
}


export interface ChatMessage {
  id: string
  sender?: ChatUser
  content?: string
  embed?: EmbedData
  series?: SeriesType
  reactions?: Reaction[]
  type?: "message" | "system"
  createdAt: string
}

export interface Reaction {
  emoji: string
  count: number
  reactedByMe?: boolean
}
