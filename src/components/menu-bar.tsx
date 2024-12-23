import { Book, BookOpenText, Home, Map, NotebookPen, Pen, PencilLine, Settings, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MenuBar() {
  const navigate = useNavigate()

  function handlePage(path: string) {
    navigate(path)
  }

  return (
    <div className="w-full flex justify-center bottom-2 fixed z-50 group">
      <div className="flex p-4 bg-primary-foreground rounded-xl bottom-4 justify-between w-fit border group-hover:opacity-100 opacity-100 transition">
        <div className="flex gap-8">
          <Book size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
          <UserPen size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
          <Map size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
          <PencilLine size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
          <Home onClick={() => handlePage('/')} size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
          <Settings size={22} strokeWidth={'1.5px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
        </div>
      </div>
    </div>
    
  )
}