'use client';
import ReportCard from '@/components/dashboard/ReportCard/ReportCard';
import ReportHistory from '@/components/history/reportHistory/reportHistory';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import useAppStore from '@/store';
import styles from './history.module.scss';

export default function HistoryPage() {
	const { selectedDate } = useAppStore((state) => state.eyeTracking);
	const { historyPageText } = useTranslationData();

	return (
		<div className={styles.container}>
			<div className={styles.leftcontainer}>
				<div className={styles.header}>
					<h1>{historyPageText.title}</h1>
					<p>{historyPageText.subtitle}</p>
					<p style={{ color: '#7baf7b', fontSize: '14px', margin: '8px 0 0 0' }}>
						{historyPageText.viewingData}{' '}
						{selectedDate
							? new Date(selectedDate).toLocaleDateString()
							: historyPageText.today}
					</p>
				</div>
				<ReportHistory />
			</div>

			<div className={styles.rightcontainer}>
				<ReportCard />
				<div className={styles.panel}>
					<h2>{historyPageText.eyeCareReport}</h2>
					<Link href="/history" className={styles.Historysection}>
						<p className={styles.title}>{historyPageText.monthlyReport}</p>
						<p className={styles.description}>{historyPageText.monthlyDate}</p>
					</Link>
					<Link href="/history" className={styles.Historysection}>
						<p className={styles.title}>{historyPageText.annualReport}</p>
						<p className={styles.description}>{historyPageText.annualDate}</p>
					</Link>
					<span className={styles.footer}>
						<p>{historyPageText.allRecordsSecure}</p>
						<button className={styles.exportButton}>
							{historyPageText.exportAllData}
						</button>
					</span>
				</div>
			</div>
		</div>
	);
}
