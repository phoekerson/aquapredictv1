import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Force Node.js runtime for file processing
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = 'AIzaSyDQ1d1dApfTvIpotJXkm6b0hZ37lwVdpn8';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('Starting file analysis...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.type, file.size);

    // Read file content based on type
    let textContent = '';
    let fileType = file.type;
    const fileName = file.name;

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer size:', buffer.length);

    try {
      if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        console.log('Parsing Excel file...');
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const sheets: any = {};
        
        sheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        });
        
        textContent = JSON.stringify(sheets, null, 2);
        fileType = 'excel';
        console.log('Excel parsed, content length:', textContent.length);
      } else if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        console.log('Parsing Word file...');
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        textContent = result.value;
        fileType = 'word';
        console.log('Word parsed, content length:', textContent.length);
      } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        console.log('Parsing PDF file...');
        const pdfParse = await import('pdf-parse');
        const data = await pdfParse.default(buffer);
        textContent = data.text;
        fileType = 'pdf';
        console.log('PDF parsed, content length:', textContent.length);
      } else {
        console.log('Treating as text file...');
        textContent = buffer.toString('utf-8');
      }
    } catch (parseError: any) {
      console.error('File parsing error:', parseError);
      // If parsing fails, try as text
      textContent = buffer.toString('utf-8');
      console.warn('Using as text fallback');
    }

    if (!textContent || textContent.length < 10) {
      console.error('No content extracted from file');
      return NextResponse.json(
        { error: 'Impossible d\'extraire le contenu du fichier' },
        { status: 400 }
      );
    }

    console.log('Preparing Gemini prompt...');
    
    // Prepare prompt for Gemini
    const prompt = `Analyse ce document de recherche ou rapport sur la qualité de l'eau et la surveillance épidémiologique. 

Document (${fileType}): ${fileName}

Contenu:
${textContent.substring(0, 50000)} ${textContent.length > 50000 ? '... (tronqué)' : ''}

Fournis une analyse détaillée en français avec:
1. Résumé exécutif (2-3 phrases)
2. Points clés identifiés (liste à puces)
3. Données quantitatives importantes (nombres, pourcentages, statistiques)
4. Recommandations (liste)
5. Risques identifiés (liste)
6. Tendances observées

Format la réponse en JSON avec cette structure:
{
  "summary": "résumé en 2-3 phrases",
  "keyPoints": ["point 1", "point 2", ...],
  "quantitativeData": [
    {"label": "nom de la métrique", "value": "valeur", "unit": "unité"},
    ...
  ],
  "recommendations": ["recommandation 1", ...],
  "risks": ["risque 1", ...],
  "trends": ["tendance 1", ...]
}`;

    console.log('Calling Gemini API...');
    
    // Get Gemini model (using requested Gemini 2.5 flash lite model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    console.log('Gemini response received, length:', analysisText.length);

    // Try to parse JSON from response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       analysisText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (e) {
      // If parsing fails, create structured response from text
      analysis = {
        summary: analysisText.substring(0, 500),
        keyPoints: analysisText.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).slice(0, 10),
        quantitativeData: [],
        recommendations: [],
        risks: [],
        trends: [],
        rawText: analysisText
      };
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      analysis,
      textLength: textContent.length
    });

  } catch (error: any) {
    console.error('Error analyzing file:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze file',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

