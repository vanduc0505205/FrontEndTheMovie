import axios from 'axios'

// Sau khi đầy đủ api của room thì chuyển về folder types
export interface Room {
  _id: string
  name: string
}

export const getRooms = async (): Promise<Room[]> => {
  const { data } = await axios.get('http://localhost:3000/room')
  return data
}
