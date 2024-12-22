import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getSeriesPath } from '../paths';

export async function updateSeries({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)
  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  await writeAsync(getSeriesPath(name), data)
  return data
}