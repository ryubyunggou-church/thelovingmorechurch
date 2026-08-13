import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
}

interface TabbedPageProps {
  tabs: TabItem[]
  defaultTab?: string
}

/** State-based tabs — URL does not change on switch (PRD architecture). */
export function TabbedPage({ tabs, defaultTab }: TabbedPageProps) {
  if (!tabs.length) return null
  const first = defaultTab ?? tabs[0]!.key

  return (
    <Tabs defaultValue={first}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
