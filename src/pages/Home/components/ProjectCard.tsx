import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  type: string
  resume: string
}

export function ProjectCard({ title, type, resume }: ProjectCardProps) {
  return (
    <Card className="hover:bg-secondary/30 cursor-pointer transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{resume}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Badge className="text-sm">{type}</Badge>
      </CardFooter>
    </Card>
  )
}