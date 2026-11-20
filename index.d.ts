import { Trip } from '@revx/shared';
export interface AggregatedStats {
    tripCount: number;
    totalDistanceKm: number;
    totalDurationSeconds: number;
    totalFuelUsedLitres: number;
    totalCo2Kg: number;
    avgEcoScore: number;
    avgSafetyScore: number;
    avgFuelEfficiencyL100km: number;
    totalFuelSavedLitres: number;
    totalMoneySaved: number;
    totalCo2AvoidedKg: number;
    totalHarshAccels: number;
    totalHarshBrakes: number;
    totalSharpTurns: number;
}
export interface TrendComparison {
    metric: string;
    currentValue: number;
    previousValue: number;
    percentageChange: number;
    isImprovement: boolean;
    narrative: string;
}
export declare class AnalyticsAggregator {
    /**
     * Aggregates a list of trips into composite performance statistics
     */
    static aggregate(trips: Trip[]): AggregatedStats;
    /**
     * Compares current period stats with previous period to generate genuine trend narratives
     */
    static comparePeriods(currentTrips: Trip[], previousTrips: Trip[]): {
        ecoTrend: TrendComparison;
        safetyTrend: TrendComparison;
        fuelEfficiencyTrend: TrendComparison;
    };
    /**
     * Groups trips into day-of-week buckets for weekly dashboard charts
     */
    static groupByDayOfWeek(trips: Trip[]): Array<{
        day: string;
        distanceKm: number;
        fuelUsedLitres: number;
        co2Kg: number;
        ecoScore: number;
        tripCount: number;
    }>;
}
//# sourceMappingURL=index.d.ts.map