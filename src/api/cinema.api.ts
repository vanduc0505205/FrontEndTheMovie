import axios from 'axios'

// Sau khi đầy đủ api của cinema thì chuyển về folder types
export interface Cinema {
  _id: string
  name: string
}

export const getCinemas = async (): Promise<Cinema[]> => {
  const { data } = await axios.get('http://localhost:3000/cinema')
  return data
}
