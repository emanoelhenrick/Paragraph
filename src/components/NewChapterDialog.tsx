import { PlusIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useProjectInfo } from "@/states/project-state";
import services from "@/electron/electronApi";

export function NewChapterDialog({ handleEditor }: { handleEditor: (id: string) => void }) {

  const projectInfo = useProjectInfo(state => state.info)
  const setProjectInfo = useProjectInfo(state => state.setInfo)
  const [chapterTitle, setChapterTitle] = useState('')

  async function handleSubmit() {
    const newChapterProps = {
      projectId: projectInfo!.id,
      chapterTitle,
      position: projectInfo!.chapters ? projectInfo!.chapters.length : 1
    }

    const newChapterId = await services.createNewChapter(newChapterProps)
    const newChapter = { id: newChapterId, title: chapterTitle, position: newChapterProps.position }
    const newChapters = [ ...projectInfo.chapters, newChapter]
    projectInfo.chapters = newChapters
    setProjectInfo({ ...projectInfo })
    handleEditor(newChapterId)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PlusIcon className="size-5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
        </DialogHeader>
        <Input onChange={e => setChapterTitle(e.currentTarget.value)} placeholder="Chapter Title" />
        <DialogClose asChild>
          <Button onClick={handleSubmit} className="w-full mt-2">Create</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}