// app/contexts/risk-context.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

// ROUTE 타입
const ROUTES = [
  "/components/check-accident",
  "/components/check-risk",
  "/",
] as const; 

export type AppRoute = (typeof ROUTES)[number];

// tbm 타입
export type TbmKey = 'precautions' | 'checklist' | 'management';

export type Tbm = Record<TbmKey, string[]>;

// TBM 라벨 공통 정의
export const TBM_LABELS: Record<TbmKey, string> = {
  precautions: '작업 시 주의사항',
  checklist: '점검항목',
  management: '시공관리',
};

// 사고 케이스 타입
type AccidentCase = {
  chunk_id: string;
  chunk_content: string;
  metadata: {
    case_no: number;
    [key: string]: any;
  };
};

export type SelectOption = { value: '3'|'2'|'1'|'-'; label: '즉시개선'|'개선'|'현재상태유지'|'미정'; code: '상'|'중'|'하'|'모름' };
export const RISK_VALUES: SelectOption[] = [
  { value: '3', label: '즉시개선',     code: '상' },
  { value: '2', label: '개선',         code: '중' },
  { value: '1', label: '현재상태유지', code: '하' },
  { value: '-', label: '미정', code: '모름' },
];

type Measure = {
  level: string;
  score: string;
};

type Hazard = {
  hazard_category: string;
  hazard_cause: string;
  hazard_detail: string;
  legal_reference: string;
  safety_measures: string[];
  risk_likelihood: Measure;
  risk_severity: Measure;
  risk_level: Measure;
  mitigation: string | null;
  current_safety_measures: string | null;
  current_risk_value: string | null;
  residual_risk_value: string | null;
};

type RiskState = {
  process: string;
  equipments: string;
  hazard: Hazard[];
  accidents: AccidentCase[];
  tbm: Tbm;
  setProcess: (v: string) => void;
  setEquipments: (v: string) => void;
  setHazard: (v: Hazard[]) => void;
  setAccidents: (v: AccidentCase[]) => void;
  setTbm: (v: Tbm) => void;
  /** ↓↓↓ 추가: 서버로부터 hazard 생성하기 */
  refreshHazardFromProcess: () => Promise<void>;
  refreshAccidentFromProcess: () => Promise<void>;
  refreshTbmFromProcess: () => Promise<void>;
  /** 선택: 로딩/에러 상태도 노출하면 편함 */
  loading: boolean;
  error: string | null;
  acciLoading: boolean;
  acciError: string | null;
  tbmloading: boolean;
  tbmError: string | null;
  reset: () => void;
};

const Ctx = createContext<RiskState|null>(null);

export function RiskProvider({children}:{children:React.ReactNode}) {
  const [process, setProcess] = useState('기계설비공사 > 배관공사 > 강관 > 용접접합');
  const [equipments, setEquipments] = useState('덤프트럭');
  const [hazard, setHazard] = useState([
  {
    "hazard_category": "-",
    "hazard_cause": "-",
    "hazard_detail": "-",
    "legal_reference": "-",
    "safety_measures": [
      "-"
    ],
    "risk_likelihood": {
      "level": "-",
      "score": "-"
    },
    "risk_severity": {
      "level": "-",
      "score": "-"
    },
    "risk_level": {
      "level": "-",
      "score": "-"
    },
    "mitigation": null,
    "current_safety_measures": null,
    "current_risk_value": null,
    "residual_risk_value": null
  }]);

  // 사고 사례
  const [accidents, setAccidents] = useState<AccidentCase[]>([]);

  // TBM
  const [tbm, setTbm] = useState<Tbm>(
    {
      precautions: [],
      checklist: [],
      management: []
    }
  );

  // 통신 상태
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  
  // 통신 상태
  const [acciLoading, setAcciLoading] = useState(false);
  const [acciError, setAcciError]     = useState<string | null>(null);

  
  // 통신 상태
  const [tbmloading, setTbmLoading] = useState(false);
  const [tbmError, setTbmError]     = useState<string | null>(null);

  // 서버 호출 → hazard 갱신
  const refreshHazardFromProcess = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://43.200.214.138:8080/risk-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          RiskAssessment: { description: process },
      }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    // 응답은 application/json의 배열 형태
    const ct = res.headers.get('content-type') || '';
    const raw = ct.includes('application/json') ? await res.json() : await res.text();

    // 배열 안전 파싱
    const items: any[] =
    Array.isArray(raw) ? raw
    : Array.isArray((raw as any)?.answer) ? (raw as any).answer
    : [];

    const nextHazard = items
    setHazard(nextHazard);

    } catch (e: any) {
        setError(e?.message ?? String(e));
    } finally {
        setLoading(false);
    }
  };

  // 사고사례
  function parseJsonlToAccidentCases(jsonlText: string): AccidentCase[] {
    return jsonlText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => JSON.parse(line) as AccidentCase);
  }

  async function loadAllAccidentsFromAsset(): Promise<AccidentCase[]> {
    // 번들에 포함된 jsonl 파일을 Asset으로 가져오기
    const asset = Asset.fromModule(
      require('../../data/accidents_cases.jsonl')
    );

    // 로컬에 실제 파일이 없으면 다운로드 (첫 실행 시)
    await asset.downloadAsync();

    // 실제 파일 경로
    const fileUri = asset.localUri ?? asset.uri;

    let text: string;

    if (Platform.OS === 'web') {
      // 🌐 웹에서는 FileSystem 대신 fetch 사용
      const res = await fetch(fileUri);
      text = await res.text();
    } else {
      // 📱 네이티브(iOS/Android)에서만 FileSystem 사용
      text = await FileSystem.readAsStringAsync(fileUri);
    }

    // JSONL → AccidentCase[]
    return parseJsonlToAccidentCases(text);
  }

  // 서버 호출 → accident 갱신
  const refreshAccidentFromProcess = async () => {
    try {
      setAcciLoading(true);
      setAcciError(null);
      const res = await fetch('http://43.200.214.138:8080/accident-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RiskAssessment: { description: process },
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const ct = res.headers.get('content-type') || '';
      const obj = ct.includes('application/json') ? await res.json() : await res.text();

      const items = (obj as any)["accident_case_ids"];
      const ACCIDENT_CASE_ID_LIST = items;
      type AccidentCaseId = (typeof ACCIDENT_CASE_ID_LIST)[number];

      const allAccidents = await loadAllAccidentsFromAsset();

      const filtered = allAccidents.filter(acc =>
        ACCIDENT_CASE_ID_LIST.includes(acc.metadata.case_no as AccidentCaseId),
      );

      setAccidents(filtered);

    } catch (e: any) {
      console.log('[Accident catch error]', e, e?.message);
      setAcciError(e?.message ?? String(e));
    } finally {
      setAcciLoading(false);
    }
  };

  // 서버 호출 → tbm 갱신
  const API_BASE = 'http://43.200.214.138:8080';

  type TbmApiResponse = Record<string, any>; // 응답이 { precautions_list: [...]} 이런 형태

  async function postRiskApi(endpoint: string, process: string): Promise<TbmApiResponse> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RiskAssessment: { description: process },
      }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return await res.json();  // 예: { precautions_list: [...] }
    } else {
      // 혹시 모를 상황 대비 (원하면 여기서 에러 던져도 됨)
      const text = await res.text();
      throw new Error(`Unexpected content-type: ${ct}, body: ${text}`);
    }
  }

  const refreshTbmFromProcess = async () => {
    setTbmLoading(true);
    setTbmError(null);

    try {
      const [
        precautionsData, // { precautions_list: [...] }
        checklistData,   // { checklist_list: [...] }
        managementData,  // { management_list: [...] }
      ] = await Promise.all([
        postRiskApi('/precautions', process),
        postRiskApi('/checklist', process),
        postRiskApi('/management', process),
      ]);

      // ✅ 응답 객체들을 다 펼쳐서 tbm에 머지
      setTbm(prev => ({
        ...prev,
        ...precautionsData,
        ...checklistData,
        ...managementData,
      }));
    } catch (e: any) {
      setTbmError(e?.message ?? String(e));
    } finally {
      setTbmLoading(false);
    }
  };

  const value = useMemo(() => ({
    process, equipments, hazard, accidents, tbm,
    setProcess, setEquipments, setHazard, setAccidents, setTbm, refreshHazardFromProcess, refreshAccidentFromProcess, refreshTbmFromProcess, loading, error, acciLoading, acciError, tbmloading, tbmError,
    reset: () => { setProcess('기계설비공사 > 배관공사 > 강관 > 용접접합'); setEquipments('덤프트럭'); 
      setHazard([{
        hazard_category: "-",
        hazard_cause: "-",
        hazard_detail: "-",
        legal_reference: "-",
        safety_measures: ["-"],
        risk_likelihood: { level: "-", score: "-" },
        risk_severity: { level: "-", score: "-" },
        risk_level: { level: "-", score: "-" },
        mitigation: null,
        current_safety_measures: null,
        current_risk_value: null,
        residual_risk_value: null,
      }]);
    },
  }), [process, equipments, hazard, accidents, tbm, loading, error,  acciLoading, acciError, tbmloading, tbmError]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRisk() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRisk must be used within <RiskProvider>');
  return v;
}
