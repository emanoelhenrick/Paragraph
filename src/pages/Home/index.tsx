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
import { ModeToggle } from "@/components/ui/mode-toggle"


const allProjects = [
  {
    type: 'book',
    title: 'Lord of the rings',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 27) as any
  },
  {
    type: 'script',
    title: 'Dune - Part 2',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 16) as any
  },
  {
    type: 'book',
    title: 'American Gods',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 10, 2) as any
  },
  {
    type: 'script',
    title: 'The Witch',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 28) as any
  },
  {
    type: 'book',
    title: 'Flowers to Algernon',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 27) as any
  },
  {
    type: 'note',
    title: 'Thoughts',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 4) as any
  }
]

allProjects.sort((a, b) => {
  return a.updatedAt - b.updatedAt;
});

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
          {projects.map(p =>  (<ProjectCard title={p.title} type={p.type} description={p.description} updatedAt={p.updatedAt} key={p.title} />))}
        </div>
       : <p className="opacity-80">You don't have any project with this type</p>}

       <ModeToggle />
    </div>
  )
}

