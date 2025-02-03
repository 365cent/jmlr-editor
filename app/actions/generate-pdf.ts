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

  // Header
  doc.setFontSize(8)
  doc.text("Journal of Machine Learning Research 23 (2024) 1-4", 20, 20)
  const currentDate = new Date().toLocaleDateString()
  const submissionText = `Submitted 1/21; Revised 5/22; Published ${currentDate}`
  doc.text(submissionText, doc.internal.pageSize.width - 20, 20, { align: "right" })

  // Title
  doc.setFontSize(16)
  const title = content.title || "Sample JMLR Paper"
  const titleWidth = doc.getTextWidth(title)
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 40)

  // Authors
  doc.setFontSize(12)
  let yPos = 55
  content.authors.split("\n").forEach((author) => {
    const [name, affiliation, email] = author.split("|").map((s) => s?.trim() || "")
    const [department, university, address] = affiliation?.split(",").map((s) => s?.trim() || "") || []

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
  doc.setFont("times", "normal")
  doc.setFontSize(14)
  doc.text("Abstract", (doc.internal.pageSize.width - doc.getTextWidth("Abstract")) / 2, yPos)

  yPos += 10
  doc.setFontSize(12)
  const abstractLines = doc.splitTextToSize(content.abstract, doc.internal.pageSize.width - 40)
  doc.text(abstractLines, 20, yPos)

  // Main content sections
  yPos += abstractLines.length * 7 + 10

  // Introduction
  doc.setFontSize(14)
  doc.text("1. Introduction", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  const introLines = doc.splitTextToSize(content.introduction, doc.internal.pageSize.width - 40)
  doc.text(introLines, 20, yPos)

  // Methods
  yPos += introLines.length * 7 + 10
  doc.setFontSize(14)
  doc.text("2. Methods", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  const methodsLines = doc.splitTextToSize(content.methods, doc.internal.pageSize.width - 40)
  doc.text(methodsLines, 20, yPos)

  // Results
  yPos += methodsLines.length * 7 + 10
  doc.setFontSize(14)
  doc.text("3. Results", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  const resultsLines = doc.splitTextToSize(content.results, doc.internal.pageSize.width - 40)
  doc.text(resultsLines, 20, yPos)

  // Conclusion
  yPos += resultsLines.length * 7 + 10
  doc.setFontSize(14)
  doc.text("4. Conclusion", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  const conclusionLines = doc.splitTextToSize(content.conclusion, doc.internal.pageSize.width - 40)
  doc.text(conclusionLines, 20, yPos)

  // References
  yPos += conclusionLines.length * 7 + 10
  doc.setFontSize(14)
  doc.text("References", 20, yPos)
  yPos += 10
  doc.setFontSize(12)
  content.references.split("\n").forEach((reference, index) => {
    const refLines = doc.splitTextToSize(`${index + 1}. ${reference}`, doc.internal.pageSize.width - 40)
    doc.text(refLines, 20, yPos)
    yPos += refLines.length * 7
  })

  // Footer
  doc.setFontSize(8)
  doc.text("©2024 The Authors.", 20, doc.internal.pageSize.height - 20)
  doc.text("License: CC-BY 4.0", 20, doc.internal.pageSize.height - 15)

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

