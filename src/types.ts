
export interface Law {
  id: string;
  title: string;
  description: string;
  category: string;
  isoImpact: string;
  impactLevel: 'Alto' | 'Medio' | 'Bajo';
  status: 'Vencido' | 'Cumple' | 'Pendiente' | 'En Revisión';
  dateAdded: string;
  // AI Generated fields
  aiSummary?: string;
  actionSteps?: string[];
  estimatedFine?: string;
  deadline?: string; // New: Critical deadline date or timeframe
  complianceProgress?: number; // New: 0-100 percentage
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export type IndustryType = 'Minería' | 'Transporte' | 'Alimentos' | 'Construcción' | 'Química' | 'Tecnología' | 'Fintech';

export interface AuditResult {
  compliant: boolean;
  verdictTitle: string;
  analysis: string;
  confidence: number;
}
