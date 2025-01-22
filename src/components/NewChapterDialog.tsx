import { PlusIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Chapter } from "electron/core/models/Chapter";
import { useProject } from "@/states/project-state";

export function NewChapterDialog() {

  const currentProjectId = useProject(state => state.currentProjectId)
  const [chapterTitle, setChapterTitle] = useState('')

  function handleSubmit() {
    const newChapterProps = {
      projectId: currentProjectId,
      chapterTitle,
      position: 1
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PlusIcon width={20} height={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input onChange={e => setChapterTitle(e.currentTarget.value)} placeholder="Chapter Title" />
          <DialogClose asChild>
            <Button type="submit" className="w-full mt-2">Create</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}