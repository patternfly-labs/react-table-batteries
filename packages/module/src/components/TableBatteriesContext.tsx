import React from 'react';
import { TableBatteries } from '../types';

// TODO ok, so we need to pass the TS generics like TItem, etc into the TableBatteries type here all the way where context is created.
//      but that's impossible because we won't be able to infer those types until we have the returned batteries object in scope.
//      so if we want the batteries object in scope in these components that don't have access to those generics, we either need to use unknown or we can't use context.
//      there are workarounds for this like in https://hipsterbrown.com/musings/musing/react-context-with-generics/, but they still require you
//      explicitly know the types you need at the site where you consume the context (inside these components where we don't know the types).
export type UnknownTableBatteries = TableBatteries<unknown, string, string, string, string>;

export const TableBatteriesContext = React.createContext<UnknownTableBatteries | undefined>(undefined);

export const TableBatteriesProvider: React.FC<{ batteries: UnknownTableBatteries; children: React.ReactNode }> = ({
  batteries,
  children
}) => <TableBatteriesContext.Provider value={batteries}>{children}</TableBatteriesContext.Provider>;

export const useTableBatteriesContext = () => React.useContext(TableBatteriesContext);
