import { mkdir, create, BaseDirectory } from '@tauri-apps/plugin-fs';

interface ContentProps {
  type: string,
  title: string,
  description: string
}

export async function createProjectFile({ title, type, description }: ContentProps) {
  const content = {
    title,
    type,
    description,
    updatedAt: new Date()
  }

  try {
    await mkdir(`projects/${content.title.toLowerCase().replace(/\s+/g, '-')}`, { baseDir: BaseDirectory.AppLocalData })
    const file = await create(`projects/${content.title.toLocaleLowerCase().replace(/\s+/g, '-')}/meta.json`, { baseDir: BaseDirectory.AppLocalData })
    await file.write(new TextEncoder().encode(JSON.stringify(content)));
    await file.close();
  } catch (error) {
    console.log(error);
  }
}

