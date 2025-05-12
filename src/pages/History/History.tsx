import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import HistoryDate from '../../components/HistoryDate'
import { anilistId } from '../../../prototype-test'

const History = () => {
  const [histories, setHistories] = useState<Array<any>>([])

  useEffect(() => {
    axios.post("https://graphql.anilist.co", {
      query: `
            query ($userId: Int) {
                Page(perPage: 50, page: 1) {
                    activities(userId: $userId, sort: ID_DESC) {
                        ... on ListActivity {
                            id
                            status
                            progress
                            updatedAt: createdAt
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
                    }
                }
            }
        `,
      variables: {
        userId: anilistId // ganti sesuai kebutuhan
      }
    }).then((response: AxiosResponse) => {
      const activities = response.data.data.Page.activities;
      console.log(activities)
      const filtered = activities.filter((a: any) => a.media && a.status !== "completed");
      setHistories(filtered);
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <HistoryDate histories={histories} />
    </div>
  )
}

export default History