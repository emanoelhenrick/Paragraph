"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "@radix-ui/react-icons"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import services from "@/electron/electronApi"
import { useNavigate } from "react-router-dom"
import { useProjectInfo } from "@/states/project-state"

const formSchema = z.object({
  title: z.string().min(2).max(50)
})

export function NewProjectDialog() {
  const navigate = useNavigate()
  const updateProjectInfo = useProjectInfo(state => state.setInfo)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const projectId = await services.createNewProject({ name: values.title })
    const projectInfo = await services.getProjectInfo(projectId)
    if (!projectInfo) return
    updateProjectInfo(projectInfo)
    navigate(`/project/chapter/${projectId}`)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PlusIcon width={20} height={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit">Create</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}