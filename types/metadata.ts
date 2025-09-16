/* eslint-disable @typescript-eslint/no-explicit-any */
export type VisualizationType = "table" | "bar" | "line" | "pie" | "kpi" | "none";

export interface TableData {
    headers: string[];
    rows: any[][];
}

export interface ChartItem {
    label: string;
    value: number;
}

export interface KpiItem {
    label: string;
    value: number | string;
    unit?: string;
    trend?: "up" | "down" | "neutral";
}

export interface Metadata {
    type: VisualizationType;
    title?: string;
    description?: string;
    data: {
        headers?: string[];   // for table
        rows?: any[][];       // for table
        items?: ChartItem[];  // for charts (bar, line, pie)
        kpis?: KpiItem[];     // for KPIs
    };
}
