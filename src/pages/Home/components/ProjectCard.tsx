import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format, formatDistance } from 'date-fns'

interface ProjectCardProps {
  title: string
  type: string
  description: string,
  updatedAt: string
}

export function ProjectCard({ title, type, description, updatedAt }: ProjectCardProps) {
  return (
    <Card className="hover:bg-secondary/30 cursor-pointer transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {type == 'book' && <Badge className="text-sm bg-blue-400">{type}</Badge>}
        {type == 'script' && <Badge className="text-sm bg-green-400">{type}</Badge>}
        {type == 'note' && <Badge className="text-sm bg-orange-400">{type}</Badge>}

        <p className="text-sm opacity-50">{formatDistance(new Date(), updatedAt)}</p>
      </CardFooter>
    </Card>
  )
}