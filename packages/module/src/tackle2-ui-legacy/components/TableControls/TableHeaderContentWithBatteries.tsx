import React from 'react';
import { Th } from '@patternfly/react-table';

export interface TableHeaderContentWithBatteriesProps {
  numColumnsBeforeData: number;
  numColumnsAfterData: number;
  children: React.ReactNode;
}

export const TableHeaderContentWithBatteries: React.FC<TableHeaderContentWithBatteriesProps> = ({
  numColumnsBeforeData,
  numColumnsAfterData,
  children
}) => (
  <>
    {Array(numColumnsBeforeData)
      .fill(null)
      .map((_, i) => (
        <Th key={i} />
      ))}
    {children}
    {Array(numColumnsAfterData)
      .fill(null)
      .map((_, i) => (
        <Th key={i} />
      ))}
  </>
);
