import React, { createContext, useContext, useState } from 'react';

// 작업정보 타입
export type WorkInfo = {
  value: string;
  label: string;
};

// 사용장비 타입
export type Equipment = {
  value: string;
  label: string;
};

// Context 타입
type WorkContextType = {
  selectedWork: WorkInfo | undefined;
  setSelectedWork: (work: WorkInfo | undefined) => void;
  selectedEquipment: Equipment | undefined;
  setSelectedEquipment: (equipment: Equipment | undefined) => void;
  clearSelections: () => void;
};

// Context 생성
const WorkContext = createContext<WorkContextType | undefined>(undefined);

// Provider 컴포넌트
export function WorkProvider({ children }: { children: React.ReactNode }) {
  const [selectedWork, setSelectedWork] = useState<WorkInfo | undefined>();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | undefined>();

  const clearSelections = () => {
    setSelectedWork(undefined);
    setSelectedEquipment(undefined);
  };

  return (
    <WorkContext.Provider
      value={{
        selectedWork,
        setSelectedWork,
        selectedEquipment,
        setSelectedEquipment,
        clearSelections,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
}

// Hook
export function useWork() {
  const context = useContext(WorkContext);
  if (!context) {
    throw new Error('useWork must be used within WorkProvider');
  }
  return context;
}