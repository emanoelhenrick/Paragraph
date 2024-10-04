import { ProjectCard } from "./components/ProjectCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/pages/Home/components/CategoriesFilter"
import { useEffect, useState } from "react"
import { NewProjectDialog } from "./components/NewProjectDialog"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { getAllProjects } from "@/core/files/getAllProjects"

interface ContentProps {
  type: string,
  title: string,
  description: string,
  updatedAt: Date
}

export function Home() {
  const [category, setCategory] = useState('all')
  const [allProjects, setAllProjects] = useState<ContentProps[]>([])
  const [projects, setProjects] = useState<ContentProps[]>([])

  async function updateLocalProjects() {
    const p = await getAllProjects()
    if (p) setAllProjects(p)
  }

  useEffect(() => {
    updateLocalProjects()
  }, [])

  useEffect(() => {
    console.log('rodou useEffect 2')
    if (category == 'all') {
      setProjects(allProjects)
    } else {
      setProjects(allProjects.filter(p => p.type == category))
    }
  }, [category, allProjects])

  return (
    <div className="max-w-screen-xl p-10 m-auto h-screen flex-1 justify-center">

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <p className="text-2xl antialiased font-bold">Recentes</p>
          <Select onValueChange={(e => setCategory(e))}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="script">Scripts</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <NewProjectDialog updateLocalProjects={updateLocalProjects} />
      </div>

      {allProjects ? 
        <div className="grid grid-cols-3 gap-6">
          {projects.map(p => <ProjectCard title={p.title} type={p.type} description={p.description} updatedAt={p.updatedAt} key={p.title} />)}
        </div>
       : <p className="opacity-80">You don't have any project with this type</p>}

       <ModeToggle />
    </div>
  )
}

