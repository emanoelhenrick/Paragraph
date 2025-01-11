import { ProjectCard } from "./components/ProjectCard"
import { useEffect, useMemo, useState } from "react"
import { NewProjectDialog } from "./components/NewProjectDialog"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useMeasure } from "@uidotdev/usehooks";
import { allProjectsFake } from "./populate"
import services from "@/electron/electronApi";
import { ProjectMetaProps } from "electron/core/models/Meta";

interface ContentProps {
  id: any
  type: string,
  title: string,
  description: string,
  updatedAt: Date
}

export default function Home() {
  const [ref, { width }] = useMeasure();

  const [allProjects, setAllProjects] = useState<ProjectMetaProps[]>([])

  const columns = useMemo(() => {
    if (!width) return 3
    if (Math.floor(width / 300) > 12) return 12
    return Math.floor(width / 300) 
  }, [width])

  async function getProjects() {
    const fetchedProjects = await services.getAllProjects()
    setAllProjects(fetchedProjects)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div ref={ref} className="w-full px-10 py-8 h-screen justify-center">

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <p className="text-2xl antialiased font-bold">Recentes</p>
        </div>
        <NewProjectDialog />
      </div>

      {allProjects.length > 0 ? 
        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, fontFamily: 'sora' }} className={`grid gap-4`}>
          {allProjects.map(p => <ProjectCard id={p.id} name={p.name} key={p.name} />)}
        </div>
       : <p className="opacity-80">You don't have any project with this type</p>}

       <ModeToggle />
    </div>
  )
}

