import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistance } from 'date-fns'
import { useNavigate } from "react-router-dom"

interface ProjectCardProps {
  id: string
  title: string
  type: string
  description: string,
  updatedAt: Date
}

export function ProjectCard({ title, type, description, updatedAt, id }: ProjectCardProps) {
  const navigate = useNavigate()

  function handleProjectPage() {
    navigate(`/project?id=${id}`)
  }


  return (
    <Card onClick={handleProjectPage} className="hover:bg-secondary/30 bg-primary-foreground cursor-pointer transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {type == 'book' && <Badge className="text-sm bg-blue-300">{type}</Badge>}
        {type == 'script' && <Badge className="text-sm bg-green-300">{type}</Badge>}
        {type == 'note' && <Badge className="text-sm bg-orange-300">{type}</Badge>}
        <p className="text-sm opacity-50">{formatDistance(new Date(), updatedAt)}</p>
      </CardFooter>
    </Card>
  )
}