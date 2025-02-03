import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"

interface JMLREditorProps {
  content: {
    title: string
    authors: string
    abstract: string
    introduction: string
    methods: string
    results: string
    conclusion: string
    references: string
  }
  setContent: React.Dispatch<React.SetStateAction<JMLREditorProps["content"]>>
}

export function JMLREditor({ content, setContent }: JMLREditorProps) {
  const handleChange = (section: keyof JMLREditorProps["content"]) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent((prev) => ({ ...prev, [section]: e.target.value }))
  }

  return (
    <Card className="h-[calc(100vh-2rem)]">
      <Tabs defaultValue="metadata" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="metadata" className="h-[calc(100%-2rem)] overflow-auto">
          <CardContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="title">Paper Title</Label>
              <Textarea
                id="title"
                value={content.title}
                onChange={handleChange("title")}
                placeholder="Enter the title of your paper"
                className="font-serif"
              />
            </div>
            <div>
              <Label htmlFor="authors" className="flex flex-col gap-1">
                <span>Authors (one per line)</span>
                <span className="text-sm text-muted-foreground">
                  Format: Name|Department, University, Address|Email
                </span>
              </Label>
              <Textarea
                id="authors"
                value={content.authors}
                onChange={handleChange("authors")}
                placeholder="Author One|Department of Statistics, University of Washington, Seattle, WA 98195-4322, USA|ONE@STAT.WASHINGTON.EDU"
                className="min-h-[150px] font-serif"
              />
            </div>
            <div>
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={content.abstract}
                onChange={handleChange("abstract")}
                placeholder="Enter your paper's abstract"
                className="min-h-[200px] font-serif"
              />
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="content" className="h-[calc(100%-2rem)] overflow-auto">
          <CardContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="introduction">1. Introduction</Label>
              <Textarea
                id="introduction"
                value={content.introduction}
                onChange={handleChange("introduction")}
                placeholder="Write your introduction here"
                className="min-h-[200px] font-serif"
              />
            </div>
            <div>
              <Label htmlFor="methods">2. Methods</Label>
              <Textarea
                id="methods"
                value={content.methods}
                onChange={handleChange("methods")}
                placeholder="Describe your methods here"
                className="min-h-[200px] font-serif"
              />
            </div>
            <div>
              <Label htmlFor="results">3. Results</Label>
              <Textarea
                id="results"
                value={content.results}
                onChange={handleChange("results")}
                placeholder="Present your results here"
                className="min-h-[200px] font-serif"
              />
            </div>
            <div>
              <Label htmlFor="conclusion">4. Conclusion</Label>
              <Textarea
                id="conclusion"
                value={content.conclusion}
                onChange={handleChange("conclusion")}
                placeholder="Write your conclusion here"
                className="min-h-[200px] font-serif"
              />
            </div>
            <div>
              <Label htmlFor="references">References (one per line)</Label>
              <Textarea
                id="references"
                value={content.references}
                onChange={handleChange("references")}
                placeholder="List your references here"
                className="min-h-[200px] font-serif"
              />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

