
interface CompanyStat {
    label: string;
    value: number;
    suffix?: string;
}

export const companyStats: CompanyStat[] = [
    { label: 'Customers in world', value: 256, suffix: '+' },
    { label: 'Total apartments', value: 196, suffix: 'k+' },
    { label: 'Total land', value: 16, suffix: 'm' }
];
export const companyStatsData: CompanyStat[] = [
    { label: 'Customers in world', value: 260, suffix: '+' },
    { label: 'Total apartments', value: 196, suffix: 'k+' },
    { label: 'Total land', value: 1626, suffix: 'm' }
];