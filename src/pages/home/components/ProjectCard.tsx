import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMeasure } from "@uidotdev/usehooks"
import { formatDistance } from 'date-fns'
import { Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ProjectCardProps {
  id: string
  name: string
  updatedAt?: Date
}

export function ProjectCard({ name, updatedAt, id }: ProjectCardProps) {
  const [ref, { width }] = useMeasure();
  const navigate = useNavigate()

  function handleProjectPage() {
    navigate(`/project/chapter/${id}`)
  }

  return (
    <div ref={ref} onClick={handleProjectPage} className="relative aspect-video bg-secondary/30 hover:bg-primary-foreground border overflow-hidden rounded-3xl cursor-pointer transition-colors flex items-end">
      <img className="absolute object-cover aspect-square p-2 brightness-50 rounded-3xl h-full w-full z-0" src='https://images.unsplash.com/photo-1510218830377-2e994ea9087d?q=80&w=2632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
      <div className="w-full p-8 flex flex-col gap-1 z-10">
        <h1 className="text-xl font-bold">{name}</h1>
        {/* <p className="text-xs font-normal text-muted-foreground flex gap-1 items-center"><Clock size={10} /> {formatDistance(new Date(), updatedAt)}</p> */}
      </div>
    </div>
  )
}