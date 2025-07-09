import axios from 'axios'

// Sau khi đầy đủ api của movie thì chuyển về folder types
export interface Movie {
  _id: string
  title: string
}

export const getMovies = async (): Promise<Movie[]> => {
  const { data } = await axios.get('http://localhost:3000/movie')
  return data
}
