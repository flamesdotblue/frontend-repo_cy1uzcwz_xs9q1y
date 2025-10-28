import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

// Lightweight CSV preview (no external deps). For demo only.
const quickCsvParse = (text, limit = 100) => {
  const rows = text.split(/\r?\n/).filter(Boolean)
  const header = rows[0]?.split(',') || []
  const dataRows = rows.slice(1, limit + 1).map((r) => r.split(','))
  return { header, rows: dataRows }
}

const detectTypes = (rows, header) => {
  const types = header.map((_, colIdx) => {
    const samples = rows
      .map((r) => r[colIdx])
      .filter((v) => v !== undefined && v !== '')
      .slice(0, 50)

    const numeric = samples.every((v) => !isNaN(Number(v)))
    if (numeric) return 'numeric'

    const maybeDate = samples.every((v) => !isNaN(Date.parse(v)))
    if (maybeDate) return 'datetime'

    return 'categorical'
  })
  return types
}

const UploadPanel = () => {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState({ header: [], rows: [] })
  const [meta, setMeta] = useState(null)
  const [error, setError] = useState('')

  const onDrop = (file) => {
    setError('')
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result || ''
      try {
        if (file.name.toLowerCase().endsWith('.json')) {
          const json = JSON.parse(content)
          const arr = Array.isArray(json) ? json : json.data || []
          if (!Array.isArray(arr) || arr.length === 0) throw new Error('No records found')
          const header = Object.keys(arr[0])
          const rows = arr.slice(0, 100).map((item) => header.map((h) => String(item[h] ?? '')))
          const types = detectTypes(rows, header)
          setPreview({ header, rows })
          setMeta({ rowsCount: arr.length, colsCount: header.length, types })
        } else {
          const { header, rows } = quickCsvParse(String(content), 100)
          const types = detectTypes(rows, header)
          setPreview({ header, rows })
          setMeta({ rowsCount: rows.length, colsCount: header.length, types })
        }
      } catch (err) {
        setError(err.message || 'Failed to parse file')
      }
    }
    reader.readAsText(file)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onDrop(file)
  }

  const reset = () => {
    setFileName('')
    setPreview({ header: [], rows: [] })
    setMeta(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section id="upload" className="relative w-full bg-[#0b0b0c] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Upload & Preview</h2>
          {fileName && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur lg:col-span-1">
            <label
              htmlFor="file-input"
              className="mb-3 block text-sm text-white/80"
            >
              Supported: CSV, JSON (client-only demo)
            </label>
            <div className="rounded-lg border border-dashed border-white/15 p-6 text-center">
              <Upload className="mx-auto text-emerald-400" size={24} />
              <p className="mt-2 text-sm text-white/70">
                Drag & drop or choose a file
              </p>
              <input
                id="file-input"
                ref={inputRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFile}
                className="mt-3 w-full cursor-pointer rounded-md bg-white/10 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-600"
              />
            </div>

            {meta && (
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-md bg-white/5 p-3">
                  <p className="text-white/60">Rows</p>
                  <p className="font-semibold">{meta.rowsCount}</p>
                </div>
                <div className="rounded-md bg-white/5 p-3">
                  <p className="text-white/60">Columns</p>
                  <p className="font-semibold">{meta.colsCount}</p>
                </div>
                <div className="rounded-md bg-white/5 p-3">
                  <p className="text-white/60">Quality</p>
                  <p className="font-semibold">Good</p>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-0 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-sm font-medium text-white">Data Preview (first 100 rows)</p>
                {fileName && <span className="text-xs text-white/60">{fileName}</span>}
              </div>
              <div className="max-h-[360px] overflow-auto">
                {preview.header.length > 0 ? (
                  <table className="min-w-full text-left text-xs text-white/80">
                    <thead className="sticky top-0 bg-white/10 text-white">
                      <tr>
                        {preview.header.map((h) => (
                          <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((r, idx) => (
                        <tr key={idx} className="odd:bg-white/0 even:bg-white/5">
                          {preview.header.map((_, cIdx) => (
                            <td key={cIdx} className="whitespace-nowrap px-3 py-1.5">
                              {r[cIdx] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-sm text-white/60">
                    No data yet. Upload a CSV or JSON to preview.
                  </div>
                )}
              </div>
            </div>

            {meta && meta.types && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <p className="mb-2 font-medium text-white">Column Classification</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {preview.header.map((h, i) => (
                    <div key={h} className="rounded-md bg-white/5 px-3 py-2">
                      <p className="truncate text-white">{h}</p>
                      <p className="text-xs text-white/60">{meta.types[i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UploadPanel
