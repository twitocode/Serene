import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <Button>Hey there</Button>
      <Slider />
    </>
  )
}
