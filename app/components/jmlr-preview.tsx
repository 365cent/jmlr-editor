import ReactMarkdown from "react-markdown"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { generatePDF } from "../actions/generate-pdf"
import { useState } from "react"

interface JMLRPreviewProps {
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
}

export function JMLRPreview({ content }: JMLRPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true)
      const url = await generatePDF(content)
      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `${content.title || "paper"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 top-4 z-10"
        onClick={handleDownloadPDF}
        disabled={isGenerating}
      >
        <Download className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Download PDF"}
      </Button>
      <Card className="bg-white overflow-auto max-h-[calc(100vh-2rem)] shadow-lg">
        <div className="p-12 max-w-[816px] mx-auto">
          {/* Journal Header */}
          <div className="text-xs text-gray-600 flex justify-between mb-16">
            <div>Journal of Machine Learning Research 23 (2024) 1-4</div>
            <div>Submitted 1/21; Revised 5/22; Published {currentDate}</div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-serif text-center mb-8">{content.title || "Sample JMLR Paper"}</h1>

          {/* Updated Authors Section */}
          <div className="mb-12 mt-8">
            {content.authors.split("\n").map((author, index) => {
              const [name, affiliation, email] = author.split("|").map((s) => s?.trim() || "")
              const [department, university, address] = affiliation?.split(",").map((s) => s?.trim() || "") || []

              return (
                <div key={index} className="mb-8 relative">
                  <div className="flex justify-between items-start">
                    <div className="font-serif text-base">{name}</div>
                    <div className="text-base font-serif">{email}</div>
                  </div>
                  <div className="mt-1 text-sm">
                    {department && <div className="italic">{department}</div>}
                    {university && <div className="italic">{university}</div>}
                    {address && <div className="italic">{address}</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Abstract */}
          <div className="mb-8">
            <h2 className="text-xl font-serif text-center mb-4">Abstract</h2>
            <div className="text-justify">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.abstract}
              </ReactMarkdown>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-8">
            <strong className="font-serif">Keywords:</strong> machine learning, artificial intelligence, research paper
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            <div className="text-justify">
              <h2 className="text-xl font-serif mb-4">1. Introduction</h2>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.introduction}
              </ReactMarkdown>

              <h2 className="text-xl font-serif mb-4 mt-8">2. Methods</h2>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.methods}
              </ReactMarkdown>
            </div>

            <div className="text-justify">
              <h2 className="text-xl font-serif mb-4">3. Results</h2>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.results}
              </ReactMarkdown>

              <h2 className="text-xl font-serif mb-4 mt-8">4. Conclusion</h2>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.conclusion}
              </ReactMarkdown>

              <h2 className="text-xl font-serif mb-4 mt-8">References</h2>
              <ol className="list-decimal list-inside space-y-2">
                {content.references.split("\n").map((reference, index) => (
                  <li key={index} className="text-sm">
                    {reference}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-xs text-gray-600">
            <p>©2024 The Authors.</p>
            <p>License: CC-BY 4.0, see https://creativecommons.org/licenses/by/4.0/</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

