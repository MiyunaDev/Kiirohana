import { useState } from 'react'
import HistoryDate from '../../components/HistoryDate'
// import { anilistId } from '../../../prototype-test'

const History = () => {
  const [histories, _] = useState<Array<any>>([])

  return (
    <div className="w-full h-full flex flex-col">
      <HistoryDate histories={histories} />
    </div>
  )
}

export default History