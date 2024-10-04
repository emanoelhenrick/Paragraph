import { readDir, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

interface ContentProps {
  type: string,
  title: string,
  description: string,
  updatedAt: Date
}

export async function getAllProjects() {
  const projects: ContentProps[] = []
  try {
    const entries = await readDir('projects', { baseDir: BaseDirectory.AppLocalData });
    entries.forEach(async (e) => {
      const metadata = JSON.parse(await readTextFile(`projects/${e.name}/meta.json`, { baseDir: BaseDirectory.AppLocalData }))
      projects.push(metadata)
    })
    return projects
  } catch (error) {
    console.log(error);
  }
}

