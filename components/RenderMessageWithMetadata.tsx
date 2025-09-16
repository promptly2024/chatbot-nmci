import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart as PieIcon, TrendingUp as LineIcon, Grid3X3 } from 'lucide-react';
import { Metadata } from '@/types/metadata';
import MarkdownRenderer from './MarkdownRenderer';

const RenderMessageWithMetadata = ({ content, metadata }: { content: string; metadata?: Metadata }) => {
    const getVisualizationIcon = (type: string) => {
        const iconProps = { size: 20, className: "text-blue-600" };
        switch (type) {
            case "table": return <Grid3X3 {...iconProps} />;
            case "bar": return <BarChart3 {...iconProps} />;
            case "line": return <LineIcon {...iconProps} />;
            case "pie": return <PieIcon {...iconProps} />;
            default: return null;
        }
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case "up": return <TrendingUp size={16} className="text-green-500" />;
            case "down": return <TrendingDown size={16} className="text-red-500" />;
            case "neutral": return <Minus size={16} className="text-gray-500" />;
            default: return null;
        }
    };

    const renderVisualization = (metadata: Metadata) => {
        switch (metadata.type) {
            case "table":
                return (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                        <table className="w-full border-collapse">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <tr>
                                    {metadata.data.headers?.map((header, idx) => (
                                        <th key={idx} className="text-left px-6 py-4 font-semibold text-gray-700 border-b border-gray-200 text-sm uppercase tracking-wide">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {metadata.data.rows?.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="hover:bg-gray-50 transition-colors duration-150">
                                        {row.map((cell, cellIdx) => (
                                            <td key={cellIdx} className="px-6 py-4 text-gray-800 text-sm whitespace-nowrap">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "bar":
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={metadata.data.items}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "line":
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={metadata.data.items}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "pie":
                const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={metadata.data.items}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={(props) => {
                                        const { name, percent } = props as { name: string; percent: number };
                                        return `${name}: ${(percent * 100).toFixed(1)}%`;
                                    }}
                                >
                                    {metadata.data.items?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "kpi":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metadata.data.kpis?.map((kpi, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                        {kpi.label}
                                    </p>
                                    {getTrendIcon(kpi.trend)}
                                </div>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                                    </p>
                                    {kpi.unit && (
                                        <span className="ml-2 text-lg font-medium text-gray-500">
                                            {kpi.unit}
                                        </span>
                                    )}
                                </div>
                                {kpi.trend && (
                                    <div className="mt-2">
                                        <p className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' :
                                                kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {kpi.trend === 'up' ? '↗ Trending up' :
                                                kpi.trend === 'down' ? '↘ Trending down' : '→ Stable'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Main content */}
            <div className="bg-white rounded-lg p-6">
                <MarkdownRenderer content={content} />
            </div>

            {/* Metadata visualization */}
            {metadata && metadata.type !== "none" && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        {getVisualizationIcon(metadata.type)}
                        <div>
                            {metadata.title && (
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {metadata.title}
                                </h3>
                            )}
                            {metadata.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {metadata.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="mt-4">
                        {renderVisualization(metadata)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenderMessageWithMetadata;