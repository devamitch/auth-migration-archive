'use client';

import CamScreen from '@/components/dashboard/EyeTracking/camscreen/CamScreen';
import BlinkRateCard from '@/components/dashboard/MetricCards/BlinkRateCard';
import EyeAgeCard from '@/components/dashboard/MetricCards/EyeAgeCard';
import EyeStrainCard from '@/components/dashboard/MetricCards/EyeStrainCard';
import ScreenTimeCard from '@/components/dashboard/MetricCards/ScreenTimeCard';
import useTranslationData from '@/hooks/use-translation-data';
import { EyeMetrics } from '@/hooks/useEyeTracking';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import useAppStore from '@/store';
import { MetricsCardData } from '@/types';
import { Clock, Eye, EyeOff, View } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import styles from './livepage.module.css';

const formatDuration = (seconds: number): string => {
	if (seconds === 0) return '0m';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	}
	return `${minutes}m`;
};

const LiveDashboard = () => {
	const {
		videoRef,
		canvasRef,
		metrics,
		loading,
		error,
		isActive,
		cameraReady,
		streamData,
		startTracking,
		stopTracking,
		getMetricsHistory,
	} = useEyeTrackingContext();
	const { livePageText } = useTranslationData();

	const { dailyScreenTime, screenTimeByHour = [] } = useAppStore((state) => state.screenTime);

	const metricsHistory = useMemo(() => getMetricsHistory() || [], [getMetricsHistory]);

	const generateChartData = useCallback((history: EyeMetrics[], key: keyof EyeMetrics) => {
		return history?.map?.((metric, index) => ({
			v: Number(metric[key]) || 0,
			high: Number(metric[key]) > (key === 'blinkRate' ? 15 : 50),
			timestamp: metric.timestamp || Date.now() - (history.length - index) * 60000, // Add timestamp
		}));
	}, []);

	const metricsData: MetricsCardData[] = useMemo(
		() => [
			{
				name: livePageText.metricNames.blinkRate,
				value: metrics?.blinkRate?.toFixed(1) || '0',
				unit: livePageText.units.perMin,
				icon: <EyeOff />,
				graphData: generateChartData(metricsHistory, 'blinkRate'),
				status: metrics?.strainText.toLowerCase() || 'low',
			},
			{
				name: livePageText.metricNames.eyeStrain,
				value: metrics?.strainLevelIdx ?? 0,
				unit: livePageText.units.level,
				icon: <Eye />,
				graphData: generateChartData(metricsHistory, 'strainLevelIdx'),
				status: metrics?.strainText.toLowerCase() || 'low',
			},
			{
				name: livePageText.metricNames.eyeAge,
				value: metrics?.eyeAge || 'N/A',
				unit: livePageText.units.years,
				icon: <View />,
				graphData: generateChartData(metricsHistory, 'eyeAge'),
				status: metrics?.tiredText.toLowerCase().replace(' ', '-') || 'low',
			},
			{
				name: livePageText.metricNames.screenTime,
				value: dailyScreenTime ? formatDuration(dailyScreenTime) : '0m',
				icon: <Clock />,
				graphData: (screenTimeByHour || [])?.map?.((minutes, hour) => ({
					v: minutes,
					high: minutes > 60,
					hour: hour,
				})),
				status: dailyScreenTime > 180 * 60 ? 'high' : 'low',
			},
		],
		[
			livePageText.metricNames.blinkRate,
			livePageText.metricNames.eyeStrain,
			livePageText.metricNames.eyeAge,
			livePageText.metricNames.screenTime,
			livePageText.units.perMin,
			livePageText.units.level,
			livePageText.units.years,
			metrics?.blinkRate,
			metrics?.strainText,
			metrics?.strainLevelIdx,
			metrics?.eyeAge,
			metrics?.tiredText,
			generateChartData,
			metricsHistory,
			dailyScreenTime,
			screenTimeByHour,
		]
	);

	const handleToggleTracking = useCallback(async () => {
		if (isActive) {
			stopTracking();
		} else {
			try {
				await startTracking();
			} catch (err) {
				console.error('Failed to start tracking:', err);
			}
		}
	}, [isActive, startTracking, stopTracking]);

	return (
		<div className={styles.container} style={{ flex: 1 }}>
			{error && (
				<div className={styles.errorBanner}>
					<span>Error: {error}</span>
					<button onClick={handleToggleTracking} className={styles.retryButton}>
						{livePageText.errorRetry}
					</button>
				</div>
			)}

			<div className={styles.mainSection}>
				<div className={styles.leftMetrics}>
					<BlinkRateCard data={metricsData[0]} metrics={metrics} />
					<EyeAgeCard
						data={metricsData[2]}
						metrics={metrics}
						faceAge={metrics?.faceAge}
					/>
				</div>

				<div className={styles.cameraSection}>
					<CamScreen
						oldVideoRef={videoRef}
						oldCanvasRef={canvasRef}
						showOverlay={isActive}
						loading={loading}
						error={error}
						isActive={isActive}
						cameraReady={cameraReady}
						onToggleTracking={handleToggleTracking}
					/>
				</div>

				<div className={styles.rightMetrics}>
					<EyeStrainCard data={metricsData[1]} metrics={metrics} />

					<ScreenTimeCard data={metricsData[3]} metrics={metrics} />
				</div>
			</div>
		</div>
	);
};

export default LiveDashboard;
