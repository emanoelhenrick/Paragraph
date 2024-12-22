import { useSearchParams } from "react-router-dom"

export default function Project() {
  let [searchParams] = useSearchParams()

  console.log(searchParams);
  
  return (
    <div>{searchParams.get('id')}</div>
  )
}