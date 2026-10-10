'use client';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import styles from './Header.module.css';

function Header() {
	const { headerText } = useTranslationData();

	return (
		<header className={styles.header}>
			<span className={styles.logoText}>{headerText.logoText}</span>

			<div className={styles.navLinks}>
				<Link href="/signin">
					<button className={styles.signInButton}>{headerText.signInButton}</button>
				</Link>
				<Link href="/register">
					<button className={styles.startButton}>{headerText.getStartedButton}</button>
				</Link>
			</div>
		</header>
	);
}

export default Header;
