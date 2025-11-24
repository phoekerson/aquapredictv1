'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  quantitativeData: Array<{ label: string; value: string; unit?: string }>;
  recommendations: string[];
  risks: string[];
  trends: string[];
  rawText?: string;
}

export function FileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<{ fileName: string; fileType: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf',
        'text/plain'
      ];
      
      const validExtensions = ['.xlsx', '.xls', '.docx', '.doc', '.pdf', '.txt'];
      const hasValidType = validTypes.includes(selectedFile.type);
      const hasValidExtension = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

      if (hasValidType || hasValidExtension) {
        setFile(selectedFile);
        setError(null);
        setAnalysis(null);
      } else {
        setError('Format de fichier non supporté. Utilisez Excel, Word ou PDF.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error('Le serveur a retourné une réponse invalide. Vérifiez la console.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAnalysis(data.analysis);
      setAnalysisMeta({ fileName: data.fileName, fileType: data.fileType });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Erreur lors de l\'analyse du fichier');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis(null);
    setAnalysisMeta(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="w-12 h-12" />;
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      return <BarChart3 className="w-12 h-12" />;
    }
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      return <FileText className="w-12 h-12" />;
    }
    if (name.endsWith('.pdf')) {
      return <FileText className="w-12 h-12" />;
    }
    return <FileText className="w-12 h-12" />;
  };

  const COLORS = ['#00ffff', '#00ff88', '#ffaa00', '#ff0066', '#8800ff'];

  const handleDownloadPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;

    const addTitle = (text: string, size = 16) => {
      doc.setFontSize(size);
      doc.setTextColor(0, 255, 255);
      doc.text(text, margin, y);
      y += 24;
    };

    const addParagraph = (text: string, size = 11) => {
      doc.setFontSize(size);
      doc.setTextColor(220);
      const lines = doc.splitTextToSize(text, 520);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 6;
    };

    const addList = (items: string[], title: string) => {
      if (!items || items.length === 0) return;
      addTitle(title, 13);
      items.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, 520);
        doc.text(lines, margin + 10, y);
        y += lines.length * 14 + 4;
      });
      y += 4;
    };

    addTitle('Rapport IA AquaPredict', 18);
    addParagraph(`Fichier analysé : ${analysisMeta?.fileName || 'N/A'} (${analysisMeta?.fileType || 'inconnu'})`);
    addParagraph(`Date : ${new Date().toLocaleString('fr-FR')}`);

    addTitle('Résumé exécutif', 14);
    addParagraph(analysis.summary);

    addList(analysis.keyPoints, 'Points clés');
    addList(analysis.recommendations, 'Recommandations');
    addList(analysis.risks, 'Risques identifiés');
    addList(analysis.trends, 'Tendances observées');

    if (analysis.quantitativeData && analysis.quantitativeData.length > 0) {
      addTitle('Données quantitatives', 14);
      analysis.quantitativeData.slice(0, 8).forEach(dataPoint => {
        addParagraph(`${dataPoint.label} : ${dataPoint.value}${dataPoint.unit ? ` ${dataPoint.unit}` : ''}`);
      });
    }

    doc.save(`rapport-${analysisMeta?.fileName || 'aquapredict'}.pdf`);
  };

  const handleDownloadDocx = async () => {
    if (!analysis) return;

    // Build all paragraphs in an array
    const allParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Rapport IA AquaPredict',
            bold: true,
            size: 32,
            color: '00FFFF',
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Fichier analysé : ${analysisMeta?.fileName || 'N/A'} (${analysisMeta?.fileType || 'inconnu'})`,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Date : ${new Date().toLocaleString('fr-FR')}`,
            size: 22,
          }),
        ],
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Résumé exécutif', bold: true, size: 26, color: '00FFFF' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: analysis.summary, size: 22 }),
        ],
      }),
      new Paragraph({ text: '' }),
    ];

    // Helper function to add a list section
    const addListParagraphs = (items: string[], title: string) => {
      if (!items || items.length === 0) return;
      
      allParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: title, bold: true, size: 26, color: '00FFFF' })],
        })
      );
      
      items.forEach((item) => {
        allParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `• ${item}`, size: 22 }),
            ],
          })
        );
      });
      
      allParagraphs.push(new Paragraph({ text: '' }));
    };

    // Add all sections
    addListParagraphs(analysis.keyPoints, 'Points clés');
    addListParagraphs(analysis.recommendations, 'Recommandations');
    addListParagraphs(analysis.risks, 'Risques identifiés');
    addListParagraphs(analysis.trends, 'Tendances observées');

    // Add quantitative data if available
    if (analysis.quantitativeData && analysis.quantitativeData.length > 0) {
      allParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Données quantitatives', bold: true, size: 26, color: '00FFFF' })],
        })
      );
      
      analysis.quantitativeData.slice(0, 8).forEach((dataPoint) => {
        allParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${dataPoint.label} : ${dataPoint.value}${dataPoint.unit ? ` ${dataPoint.unit}` : ''}`,
                size: 22,
              }),
            ],
          })
        );
      });
    }

    // Create document with all paragraphs in a single section
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: allParagraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `rapport-${analysisMeta?.fileName || 'aquapredict'}.docx`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Upload className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-cyan-400">Analyse de Documents IA</h3>
          <p className="text-sm text-gray-400">Upload Excel, Word ou PDF pour analyse détaillée</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 transition-all hover:bg-cyan-500/5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.docx,.doc,.pdf,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <p className="text-gray-300 mb-2">Cliquez pour sélectionner un fichier</p>
            <p className="text-sm text-gray-500">Excel, Word, PDF ou TXT</p>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-cyan-400">{getFileIcon()}</div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Analyser
                  </>
                )}
              </button>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg text-emerald-300 transition-all"
            >
              Télécharger PDF
            </button>
            <button
              onClick={handleDownloadDocx}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 transition-all"
            >
              Télécharger Word
            </button>
          </div>
          {/* Summary */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-cyan-500/20">
            <h4 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Résumé Exécutif
            </h4>
            <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Key Points */}
          {analysis.keyPoints && analysis.keyPoints.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-cyan-500/20">
              <h4 className="text-lg font-bold text-cyan-400 mb-4">Points Clés</h4>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantitative Data Charts */}
          {analysis.quantitativeData && analysis.quantitativeData.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-cyan-500/20">
              <h4 className="text-lg font-bold text-cyan-400 mb-4">Données Quantitatives</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis.quantitativeData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="label" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #00ffff', borderRadius: '8px' }}
                        labelStyle={{ color: '#00ffff' }}
                      />
                      <Bar dataKey="value" fill="#00ffff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.quantitativeData.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ label, value }) => `${label}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analysis.quantitativeData.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #00ffff', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-green-500/20">
              <h4 className="text-lg font-bold text-green-400 mb-4">Recommandations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {analysis.risks && analysis.risks.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-red-500/20">
              <h4 className="text-lg font-bold text-red-400 mb-4">Risques Identifiés</h4>
              <ul className="space-y-2">
                {analysis.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-1" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trends */}
          {analysis.trends && analysis.trends.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-yellow-500/20">
              <h4 className="text-lg font-bold text-yellow-400 mb-4">Tendances</h4>
              <ul className="space-y-2">
                {analysis.trends.map((trend, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4 text-yellow-400 mt-1" />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

