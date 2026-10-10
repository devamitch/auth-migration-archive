'use client';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import useAppStore from '@/store';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import styles from './reportPage.module.css';

export default function ReportPage() {
	const locale = useLocale();

	const params = useParams();
	const timestamp = Array.isArray(params.timestamp) ? params.timestamp[0] : params.timestamp;
	const { history, selectedTimeframe } = useAppStore((state) => state.eyeTracking);
	const { reportPageText } = useTranslationData();

	// Find the report with the matching timestamp
	const report = history[selectedTimeframe]?.find(
		(item) => new Date(item.timestamp).getTime().toString() === timestamp
	);

	if (!report) {
		return (
			<div className={styles.container}>
				<h1>{reportPageText.reportNotFound}</h1>
				<p>{reportPageText.reportNotFoundDesc}</p>
				<Link href={{ pathname: 'history' }} locale={locale}>
					{reportPageText.backToHistory}
				</Link>
			</div>
		);
	}

	const getStatusColor = (strainText: string) => {
		switch (strainText) {
			case 'Low':
				return styles.normal;
			case 'Moderate':
				return styles.blinkrate;
			case 'High':
				return styles.eyestrain;
			default:
				return styles.normal;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link href="/history" className={styles.backButton}>
					{reportPageText.backToHistory}
				</Link>
				<div className={styles.reportHeader}>
					<h1>{reportPageText.eyeScanReport}</h1>
					<p>{new Date(report.timestamp).toLocaleString()}</p>
				</div>
			</div>

			<div className={styles.reportContent}>
				<div className={styles.statusSection}>
					<div>
						<h2>{reportPageText.overallStatus}</h2>
						<div className={`${styles.status} ${getStatusColor(report.strainText)}`}>
							{report.strainText === 'Low'
								? reportPageText.statusLabels.normal
								: report.strainText === 'Moderate'
									? reportPageText.statusLabels.blinkRate
									: reportPageText.statusLabels.eyeStrain}
						</div>
					</div>
					{/* <button className={styles.exportButton}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							className="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"
						>
							<path d="M12 17V3" />
							<path d="m6 11 6 6 6-6" />
							<path d="M19 21H5" />
						</svg>
					</button> */}
				</div>

				<div className={styles.detailsGrid}>
					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.blinkRate}</h3>
						<p className={styles.value}>
							{report.blinkRate}
							{reportPageText.units.blinksPerMin}
						</p>
						<p className={styles.label}>{reportPageText.normalRanges.blinkRate}</p>
					</div>

					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.eyeStrainLevel}</h3>
						<p className={styles.value}>{report.strainText}</p>
					</div>

					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.tirednessLevel}</h3>
						<p className={styles.value}>{report.tiredText}</p>
					</div>

					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.attentionLevel}</h3>
						<p className={styles.value}>
							{Math.round(report.attentionFrac * 100)}
							{reportPageText.units.percentage}
						</p>
					</div>

					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.eyeAge}</h3>
						<p className={styles.value}>
							{Math.round(report.eyeAge)}
							{reportPageText.units.years}
						</p>
					</div>

					<div className={styles.detailCard}>
						<h3>{reportPageText.metricLabels.perclose}</h3>
						<p className={styles.value}>
							{report.perClose.toFixed(1)}
							{reportPageText.units.percentage}
						</p>
						<p className={styles.label}>{reportPageText.normalRanges.perclose}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
