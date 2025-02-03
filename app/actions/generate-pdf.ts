"use server"

import jsPDF from "jspdf"
import { put } from "@vercel/blob"

interface PaperContent {
  title: string
  authors: string
  abstract: string
  introduction: string
  methods: string
  results: string
  conclusion: string
  references: string
}

export async function generatePDF(content: PaperContent) {
  // Create a new PDF document
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  })

  // Set font to Times New Roman
  doc.setFont("times", "normal")

  let yPos = 20 // Starting y position
  const pageHeight = doc.internal.pageSize.height
  const margin = 20 // Bottom margin

  // Helper function to check and add new page if needed
  const checkAndAddPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPos = 20 // Reset to top of new page
      return true
    }
    return false
  }

  // Header
  doc.setFontSize(8)
  doc.text("Journal of Machine Learning Research 23 (2024) 1-4", 20, yPos)
  const currentDate = new Date().toLocaleDateString()
  const submissionText = `Submitted 1/21; Revised 5/22; Published ${currentDate}`
  doc.text(submissionText, doc.internal.pageSize.width - 20, yPos, { align: "right" })

  // Title
  yPos = 40
  doc.setFontSize(16)
  const title = content.title || "Sample JMLR Paper"
  const titleLines = doc.splitTextToSize(title, doc.internal.pageSize.width - 40)
  const titleHeight = titleLines.length * 8
  doc.text(titleLines, doc.internal.pageSize.width / 2, yPos, { align: 'center' })

  // Authors
  yPos = 55
  doc.setFontSize(12)
  content.authors.split("\n").forEach((author) => {
    const [name, affiliation, email] = author.split("|").map((s) => s?.trim() || "")
    const [department, university, address] = affiliation?.split(",").map((s) => s?.trim() || "") || []

    // Check if we need a new page for this author block
    const authorBlockHeight = 10 + (department ? 5 : 0) + (university ? 5 : 0) + (address ? 5 : 0)
    checkAndAddPage(authorBlockHeight)

    // Author name and email
    doc.setFont("times", "normal")
    doc.text(name, 20, yPos)
    doc.text(email, doc.internal.pageSize.width - 20, yPos, { align: "right" })

    // Affiliation
    doc.setFont("times", "italic")
    if (department) {
      yPos += 5
      doc.text(department, 20, yPos)
    }
    if (university) {
      yPos += 5
      doc.text(university, 20, yPos)
    }
    if (address) {
      yPos += 5
      doc.text(address, 20, yPos)
    }

    yPos += 10
  })

  // Abstract
  yPos += 5
  checkAndAddPage(50) // Approximate space for abstract header and some content
  doc.setFont("times", "normal")
  doc.setFontSize(14)
  doc.text("Abstract", (doc.internal.pageSize.width - doc.getTextWidth("Abstract")) / 2, yPos)

  yPos += 10
  doc.setFontSize(12)
  const abstractLines = doc.splitTextToSize(content.abstract, doc.internal.pageSize.width - 40)
  if (checkAndAddPage(abstractLines.length * 7)) {
    yPos += 10 // Add some spacing at top of new page
  }
  doc.text(abstractLines, 20, yPos)
  yPos += abstractLines.length * 7 + 10

  // Main content sections
  const sections = [
    { title: "1. Introduction", content: content.introduction },
    { title: "2. Methods", content: content.methods },
    { title: "3. Results", content: content.results },
    { title: "4. Conclusion", content: content.conclusion }
  ]

  sections.forEach(({ title, content }) => {
    checkAndAddPage(40) // Check space for section header and some content
    doc.setFontSize(14)
    doc.text(title, 20, yPos)
    yPos += 10
    doc.setFontSize(12)
    const contentLines = doc.splitTextToSize(content, doc.internal.pageSize.width - 40)
    
    // If content won't fit on current page
    if (checkAndAddPage(contentLines.length * 7)) {
      // Rewrite section header on new page
      doc.setFontSize(14)
      doc.text(title, 20, yPos)
      yPos += 10
      doc.setFontSize(12)
    }
    
    doc.text(contentLines, 20, yPos)
    yPos += contentLines.length * 7 + 10
  })

  // References
  checkAndAddPage(40)
  doc.setFontSize(14)
  doc.text("References", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  
  content.references.split("\n").forEach((reference, index) => {
    const refLines = doc.splitTextToSize(`${index + 1}. ${reference}`, doc.internal.pageSize.width - 40)
    if (checkAndAddPage(refLines.length * 7)) {
      yPos += 10 // Add spacing at top of new page
    }
    doc.text(refLines, 20, yPos)
    yPos += refLines.length * 7
  })

  // Footer on each page
  const pageCount = doc.internal.pages.length
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    const authorNames = content.authors.split("\n").map(author => author.split("|")[0]).slice(0,3)
    const formattedAuthors = authorNames.join(", ").replace(/, ([^,]*)$/, ' and $1')
    doc.text(`©${new Date().getFullYear()} ${formattedAuthors}${content.authors.split("\n").length > 3 ? " et al." : ""}`, 20, pageHeight - 20)
    doc.text("License: CC-BY 4.0", 20, pageHeight - 15)
  }

  // Convert PDF to blob
  const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" })
  const buffer = await pdfBlob.arrayBuffer()

  // Upload to Vercel Blob
  const { url } = await put(`paper-${Date.now()}.pdf`, buffer, {
    access: "public",
    contentType: "application/pdf",
  })

  return url
}
