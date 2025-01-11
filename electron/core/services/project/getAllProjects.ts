import { META_PATH } from "../../localPaths"
import { MetaProps } from "../../models/Meta"
import { readAsync } from "fs-jetpack"

export async function getAllProjects() {
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  if (!metadata) return []
  return metadata.projects
}