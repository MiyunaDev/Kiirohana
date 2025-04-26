import LanguageEnum from '../../enums/LanguageEnum'
import { useState } from 'react'

const historyData = [
  {
    title: "Spy x Family",
    language: LanguageEnum.JAPANESE_DUB,
    cover: "https://cdn.myanimelist.net/images/anime/1441/128941l.jpg",
    lastWatched: "2025-04-26T07:00:00Z", // Hari ini
    episode: 9,
  },
  {
    title: "Chainsaw Man",
    language: LanguageEnum.INDONESIA,
    cover: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
    lastWatched: "2025-04-25T20:00:00Z", // Kemarin
    episode: 5,
  },
  {
    title: "Attack on Titan",
    language: LanguageEnum.JAPANESE_DUB,
    cover: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    lastWatched: "2025-04-24T15:30:00Z", // 2 hari lalu
    episode: 17,
  },
  {
    title: "Jujutsu Kaisen",
    language: LanguageEnum.INDONESIA,
    cover: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    lastWatched: "2025-04-22T10:00:00Z", // 4 hari lalu
    episode: 12,
  },
  {
    title: "My Hero Academia",
    language: LanguageEnum.JAPANESE_DUB,
    cover: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg",
    lastWatched: "2025-04-20T14:00:00Z", // Minggu lalu
    episode: 8,
  },
  {
    title: "Tokyo Revengers",
    language: LanguageEnum.INDONESIA,
    cover: "https://cdn.myanimelist.net/images/anime/1831/111487l.jpg",
    lastWatched: "2025-04-15T16:00:00Z", // 11 hari lalu
    episode: 3,
  },
  {
    title: "One Piece",
    language: LanguageEnum.JAPANESE_DUB,
    cover: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
    lastWatched: "2025-04-10T18:00:00Z", // 16 hari lalu
    episode: 1050,
  },
  {
    title: "Naruto Shippuden",
    language: LanguageEnum.INDONESIA,
    cover: "https://cdn.myanimelist.net/images/anime/5/17407l.jpg",
    lastWatched: "2025-03-25T11:00:00Z", // Lebih dari 4 minggu
    episode: 421,
  },
  {
    title: "Bleach: Thousand-Year Blood War",
    language: LanguageEnum.JAPANESE_DUB,
    cover: "https://cdn.myanimelist.net/images/anime/1121/126498l.jpg",
    lastWatched: "2025-03-15T13:00:00Z", // Lebih dari 1 bulan
    episode: 6,
  },
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    language: LanguageEnum.INDONESIA,
    cover: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    lastWatched: "2025-02-10T09:00:00Z", // 2 bulan lalu
    episode: 4,
  },
]

const History = () => {
  const [ ] = useState(historyData)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 max-w-screen-xl mx-auto px-2">

    </div>
  )
}

export default History