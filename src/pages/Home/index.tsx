import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
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



const allProjects = [
  {
    type: 'book',
    title: 'Lord of the rings',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.'
  },
  {
    type: 'script',
    title: 'Dune - Part 2',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.'
  },
  {
    type: 'book',
    title: 'American Gods',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.'
  },
  {
    type: 'book',
    title: 'Flowers to Algernon',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.'
  },
  {
    type: 'script',
    title: 'The Witch',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.'
  }
]

export function Home() {

  const [category, setCategory] = useState('all')
  const [projects, setProjects] = useState(allProjects)

  useEffect(() => {
    if (category == 'all') return setProjects(allProjects)
    setProjects(allProjects.filter(p => p.type == category))
  }, [category])


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
        <NewProjectDialog />
      </div>

      {projects.length > 0 ? 
        <div className="grid grid-cols-3 gap-6">
          {projects.map(p =>  (<ProjectCard title={p.title} type={p.type} resume={p.resume} key={p.title} />))}
        </div>
       : <p className="opacity-80">You don't have any project with this type</p>}
    </div>
  )
}

