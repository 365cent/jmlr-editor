"use client"

import { useState } from "react"
import { JMLREditor } from "./components/jmlr-editor"
import { JMLRPreview } from "./components/jmlr-preview"

export default function Home() {
  const [content, setContent] = useState({
    title: "Sample JMLR Paper",
    authors:
      "Author One|Department of Statistics, University of Washington, Seattle, WA 98195-4322, USA|ONE@STAT.WASHINGTON.EDU\nAuthor Two|Division of Computer Science, University of California, Berkeley, CA 94720-1776, USA|TWO@CS.BERKELEY.EDU",
    abstract:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis facilisis sem. Nullam nec mi et neque pharetra sollicitudin.",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis facilisis sem.",
    methods:
      "Our method uses the following equation:\n\n$x = \\frac{1}{n}\\sum_{i=1}^n x_i = \\frac{x_1 + x_2 + ... + x_n}{n}$",
    results: "The results show significant improvements over baseline methods.",
    conclusion: "We have demonstrated the effectiveness of our approach.",
    references:
      "Smith, J. (2023). Machine Learning Advances. Journal of AI.\nDoe, J. (2024). Deep Learning Applications. Conference on ML.",
  })

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JMLREditor content={content} setContent={setContent} />
        <JMLRPreview content={content} />
      </div>
    </main>
  )
}

