import React from 'react';
import { Th } from '@patternfly/react-table';

export interface ITableHeaderContentWithBatteriesProps {
  numColumnsBeforeData: number;
  numColumnsAfterData: number;
  children: React.ReactNode;
}

export const TableHeaderContentWithBatteries: React.FC<ITableHeaderContentWithBatteriesProps> = ({
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
