import { ProjectCard } from "./components/ProjectCard"
import { useEffect, useMemo, useState } from "react"
import { NewProjectDialog } from "./components/NewProjectDialog"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useMeasure } from "@uidotdev/usehooks";
import { allProjectsFake } from "./populate"

interface ContentProps {
  id: any
  type: string,
  title: string,
  description: string,
  updatedAt: Date
}

export default function Home() {
  const [ref, { width }] = useMeasure();

  const [category, setCategory] = useState('all')
  const [allProjects, setAllProjects] = useState<ContentProps[]>(allProjectsFake)
  const [projects, setProjects] = useState<ContentProps[]>([])

  useEffect(() => {
    if (category == 'all') {
      setProjects(allProjects)
    } else {
      setProjects(allProjects.filter(p => p.type == category))
    }
  }, [category, allProjects])

  const columns = useMemo(() => {
    if (!width) return 3
    if (Math.floor(width / 300) > 12) return 12
    return Math.floor(width / 300) 
  }, [width])

  return (
    <div ref={ref} className="w-full px-10 py-8 h-screen justify-center">

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <p className="text-2xl antialiased font-bold">Recentes</p>
        </div>
        {/* <NewProjectDialog /> */}
      </div>

      {allProjects.length > 0 ? 
        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, fontFamily: 'sora' }} className={`grid gap-4`}>
          {projects.map(p => <ProjectCard id={p.id} title={p.title} type={p.type} description={p.description} updatedAt={p.updatedAt} key={p.title} />)}
        </div>
       : <p className="opacity-80">You don't have any project with this type</p>}

       <ModeToggle />
    </div>
  )
}

