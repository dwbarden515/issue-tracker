'use client';

import { Card } from "@radix-ui/themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface Props {
    open: number;
    inProgress: number;
    closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
    const data = [
        { label: 'Open', value: open },
        { label: 'In Progress', value: inProgress },
        { label: 'Closed', value: closed },
    ]
    return (
        <Card style={{ width: '100%' }}>
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Bar dataKey="value" barSize={60} fill="var(--accent-9)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export default IssueChart
