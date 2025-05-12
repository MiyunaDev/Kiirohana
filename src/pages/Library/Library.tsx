import Flag from 'react-world-flags'
import getFlag from '../../utils/getFlag'
import { useEffect, useState } from 'react'

import LanguageEnum from '../../enums/LanguageEnum'
import { Link } from 'react-router'
import axios from 'axios'

import { anilistId } from "./../../../prototype-test"

const Library = () => {
    const [libraries, setLibraries] = useState<Array<any>>([])

    useEffect(() => {
        const query = `
        query($userId:Int,$userName:String,$type:MediaType){
        MediaListCollection(userId:$userId, userName:$userName, type:$type){
            lists {
            name
            isCustomList
            isCompletedList: isSplitCompletedList
            entries {
                ...mediaListEntry
            }
            }
            user {
            id
            name
            avatar {
                large
            }
            mediaListOptions {
                scoreFormat
                rowOrder
                animeList {
                sectionOrder
                customLists
                splitCompletedSectionByFormat
                theme
                }
                mangaList {
                sectionOrder
                customLists
                splitCompletedSectionByFormat
                theme
                }
            }
            }
        }
        }

        fragment mediaListEntry on MediaList {
        id
        mediaId
        status
        score
        progress
        progressVolumes
        repeat
        priority
        private
        hiddenFromStatusLists
        customLists
        advancedScores
        notes
        updatedAt
        startedAt {
            year
            month
            day
        }
        completedAt {
            year
            month
            day
        }
        media {
            id
            title {
            userPreferred
            romaji
            english
            native
            }
            coverImage {
            extraLarge
            large
            }
            type
            format
            status(version: 2)
            episodes
            volumes
            chapters
            averageScore
            popularity
            isAdult
            countryOfOrigin
            genres
            bannerImage
            startDate {
            year
            month
            day
            }
        }
        }
        `;

        Promise.all([
            axios.post("https://graphql.anilist.co", {
                query,
                variables: { userId: anilistId, type: "ANIME" },
            }),
            axios.post("https://graphql.anilist.co", {
                query,
                variables: { userId: anilistId, type: "MANGA" },
            }),
        ])
            .then(([animeRes, mangaRes]) => {
                const animeEntries = animeRes.data.data.MediaListCollection.lists
                    .flatMap((list: any) => list.entries);
                const mangaEntries = mangaRes.data.data.MediaListCollection.lists
                    .flatMap((list: any) => list.entries);

                const allEntries = [...animeEntries, ...mangaEntries]
                    .sort((a: any, b: any) => b.updatedAt - a.updatedAt);

                setLibraries(allEntries);
            })
            .catch((error) => {
                console.error("Failed to fetch:", error);
            });

    }, [])
    return (
        <div className="w-full h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 max-w-screen-xl mx-auto px-2">
            {libraries.map((detail: any) => (
                <Link
                    to={`/detail/?title=${encodeURIComponent(detail.media.title.userPreferred)}`}
                    key={detail.media.id}
                    className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
                >
                    <div className="relative w-full">
                        {/* Karena tidak ada data bahasa langsung, gunakan countryOfOrigin */}
                        <Flag
                            code={getFlag("ID" as LanguageEnum)}
                            className="absolute w-1/4 top-1 left-1 z-10"
                        />

                        <p className="absolute text-xs top-1 right-1 rounded-3xl bg-[#C667F7] p-1">
                            {detail.progress ?? ""}
                        </p>

                        <img
                            className="w-full aspect-[2/3] sm:aspect-[3/4] object-cover bg-gray-300 rounded-r-xl"
                            src={detail.media.coverImage.large}
                            alt={detail.media.title.userPreferred}
                        />

                        <a className='absolute text-sm p-2 bottom-0 text-center left-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.0)]'>
                            Anilist
                        </a>
                    </div>

                    <a className='w-1/2 rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]'>
                        {detail.media.type === "ANIME" ? "Anime" : detail.media.format === "NOVEL" ? "Light Novel" : detail.media.countryOfOrigin === "JP" && detail.media.format === "MANGA" ? "Manga" : detail.media.countryOfOrigin === "CN" && detail.media.format === "MANGA" ? "Manhua" : detail.media.countryOfOrigin === "KR" && detail.media.format === "MANGA" ? "Manhwa" : "Uknown"}
                    </a>

                    <a className="w-full text-xs font-semibold text-center py-2 px-1 overflow-hidden">
                        <a className='line-clamp-2'>
                            {detail.media.title.english ?? detail.media.title.userPreferred}
                        </a>
                    </a>
                </Link>
            ))}
        </div>
    )
}

export default Library