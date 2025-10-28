import React, { useState } from 'react'
import { MessageSquare, BarChart2, Sparkles, FileText } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const tabs = [
  { key: 'chat', label: 'AI Chat', icon: MessageSquare },
  { key: 'viz', label: 'Visualizations', icon: BarChart2 },
  { key: 'clean', label: 'Cleaning', icon: Sparkles },
  { key: 'report', label: 'Reporting', icon: FileText },
]

const TabButton = ({ active, onClick, children, Icon }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
      active ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
    }`}
  >
    <Icon size={16} /> {children}
  </button>
)

const AnalysisTabs = ({ datasetId }) => {
  const [active, setActive] = useState('chat')
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatAnswer, setChatAnswer] = useState('')
  const [vizSpec, setVizSpec] = useState(null)
  const [vizLoading, setVizLoading] = useState(false)
  const [xField, setXField] = useState('')
  const [yField, setYField] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [reportMd, setReportMd] = useState('')
  const [reportLoading, setReportLoading] = useState(false)

  const sendQuestion = async () => {
    if (!datasetId) {
      setChatAnswer('Please upload and send data to backend first.')
      return
    }
    if (!question.trim()) return
    setChatLoading(true)
    setChatAnswer('')
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_id: datasetId, question }),
      })
      const data = await res.json()
      setChatAnswer(data.answer || 'No answer')
    } catch (e) {
      setChatAnswer(e.message || 'Failed to get answer')
    } finally {
      setChatLoading(false)
    }
  }

  const generateViz = async () => {
    if (!datasetId) return
    setVizLoading(true)
    setVizSpec(null)
    try {
      const res = await fetch(`${API_BASE}/api/visualize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_id: datasetId, chart_type: chartType, x: xField, y: yField }),
      })
      const data = await res.json()
      setVizSpec(data.spec)
    } catch (e) {
      setVizSpec({ error: e.message || 'Failed to generate visualization' })
    } finally {
      setVizLoading(false)
    }
  }

  const generateReport = async () => {
    if (!datasetId) return
    setReportLoading(true)
    setReportMd('')
    try {
      const res = await fetch(`${API_BASE}/api/report/${datasetId}`, { method: 'POST' })
      const data = await res.json()
      setReportMd(data.markdown || '')
    } catch (e) {
      setReportMd(e.message || 'Failed to generate report')
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <section id="chat" className="w-full bg-[#0b0b0c] py-14 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              active={active === t.key}
              onClick={() => setActive(t.key)}
              Icon={t.icon}
            >
              {t.label}
            </TabButton>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          {active === 'chat' && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="h-[260px] overflow-auto rounded-md bg-black/30 p-3 text-sm text-white/80">
                  {!datasetId && (
                    <p className="text-amber-300">Upload and send a dataset to the backend to enable AI chat.</p>
                  )}
                  {chatAnswer ? (
                    <p>{chatAnswer}</p>
                  ) : (
                    <>
                      <p className="text-white/60">Ask a question like:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>What are the top 5 categories by revenue?</li>
                        <li>Show a line chart of orders over time.</li>
                        <li>Are there any outliers in unit price?</li>
                      </ul>
                    </>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about your data..."
                    className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/40"
                  />
                  <button onClick={sendQuestion} disabled={chatLoading} className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                    {chatLoading ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white/70">
                <p className="font-medium text-white">Dynamic Suggestions</p>
                <ul className="mt-2 space-y-1">
                  <li>Summarize missing values by column</li>
                  <li>Compare average order value by segment</li>
                  <li>Build a histogram of customer age</li>
                </ul>
              </div>
            </div>
          )}

          {active === 'viz' && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-black/20 p-4 md:col-span-1">
                <p className="mb-2 text-sm font-medium text-white">Chart Builder</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <label className="mb-1 block text-white/70">Chart Type</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-2">
                      <option value="bar">Bar</option>
                      <option value="line">Line</option>
                      <option value="point">Scatter</option>
                      <option value="area">Area</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-white/70">X Column</label>
                    <input value={xField} onChange={(e) => setXField(e.target.value)} className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-white/70">Y Column</label>
                    <input value={yField} onChange={(e) => setYField(e.target.value)} className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-2" />
                  </div>
                  <button onClick={generateViz} className="mt-2 w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Generate</button>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex h-[300px] items-center justify-center rounded-md border border-white/10 bg-black/30 text-sm text-white/60">
                  {vizLoading && 'Generating…'}
                  {!vizLoading && vizSpec && (
                    <pre className="max-h-[280px] w-full overflow-auto p-3 text-left text-xs text-white/80">{JSON.stringify(vizSpec, null, 2)}</pre>
                  )}
                  {!vizLoading && !vizSpec && 'Visualization preview will appear here'}
                </div>
              </div>
            </div>
          )}

          {active === 'clean' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm font-medium text-white">Missing Values</p>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Drop</button>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Mean</button>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Median</button>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Mode</button>
                </div>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm font-medium text-white">Duplicates & Outliers</p>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Remove Duplicates</button>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">IQR Outliers</button>
                </div>
              </div>
            </div>
          )}

          {active === 'report' && (
            <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-white/80">
              <p className="mb-3 font-medium text-white">Export & Reporting</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={generateReport} className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20">Generate Report</button>
              </div>
              <div className="mt-3">
                {reportLoading && <p className="text-white/60">Generating…</p>}
                {!reportLoading && reportMd && (
                  <pre className="whitespace-pre-wrap rounded-md bg-black/30 p-3 text-xs text-white/80">{reportMd}</pre>
                )}
                {!reportLoading && !reportMd && <p className="text-white/60">Reports include dataset summary, metadata, and auto-generated charts.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AnalysisTabs
