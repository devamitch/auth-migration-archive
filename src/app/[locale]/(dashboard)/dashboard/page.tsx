'use client';

import ArticleCard from '@/components/dashboard/ArticleCard/ArticleCard';
import EyeMetricsDisplay from '@/components/dashboard/EyeTracking/EyeMetricDisplay/EyeMetricsDisplay';
import ReportHistory from '@/components/dashboard/ReportHistory/ReportHistory';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import useTranslationData from '@/hooks/use-translation-data';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { useCallback } from 'react';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
	const { metrics, error, isActive, streamData, startTracking, stopTracking } =
		useEyeTrackingContext();
	const { articlesData, dashboardPageText } = useTranslationData();

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
		<div className={styles.container}>
			{error && (
				<div className={styles.errorBanner}>
					<span>
						{dashboardPageText.errorMessage} {error}
					</span>
					<button onClick={handleToggleTracking} className={styles.retryButton}>
						{dashboardPageText.retryButton}
					</button>
				</div>
			)}

			<div className={styles.streamSection}>
				{metrics && (
					<EyeMetricsDisplay
						metrics={metrics}
						className={styles.metricsPanel}
						faceAge={metrics?.faceAge}
						eyeAge={metrics?.eyeAge}
					/>
				)}
				{/* <EyeMetricsStream metrics={metrics} streamData={streamData} /> */}
			</div>
			<ReportHistory />

			<TitleHeader title={dashboardPageText.articlesTitle} />
			<div className={styles.articlesSection}>
				{articlesData.map((article) => (
					<ArticleCard
						key={article.title}
						title={article.title}
						description={article.description}
						image={article.image}
					/>
				))}
			</div>
		</div>
	);
}
