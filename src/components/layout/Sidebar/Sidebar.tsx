'use client';

import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import { Activity, Clipboard, Eye, Home, Settings, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
	const pathname = usePathname();
	const { sidebarText } = useTranslationData();
	const locale = useLocale();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 600);
		};
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		return () => window.removeEventListener('resize', checkIfMobile);
	}, []);

	const items = [
		{
			title: sidebarText.navItems[0].title,
			url: sidebarText.navItems[0].url,
			icon: Home,
		},
		{
			title: sidebarText.navItems[1].title,
			url: sidebarText.navItems[1].url,
			icon: Activity,
		},
		{
			title: sidebarText.navItems[2].title,
			url: sidebarText.navItems[2].url,
			icon: Eye,
		},
		{
			title: sidebarText.navItems[3].title,
			url: sidebarText.navItems[3].url,
			icon: Clipboard,
		},
		{
			title: sidebarText.navItems[4].title,
			url: sidebarText.navItems[4].url,
			icon: Settings,
		},
	];
	return (
		<>
			{isMobile && isOpen && (
				<div 
					className={styles.backdrop} 
					onClick={onClose}
				/>
			)}
			
			<div className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''} ${isMobile && isOpen ? styles.mobileOpen : ''} ${isMobile && !isOpen ? styles.mobileHidden : ''}`}>
				{isMobile && (
					<button 
						className={styles.closeButton}
						onClick={onClose}
					>
						<X size={24} color="var(--metricValue)" />
					</button>
				)}
				
				<Link href="/dashboard" className={styles.header} locale={locale}>
					<span className={styles.logo}>{sidebarText.logoText}</span>
				</Link>

				<nav className={styles.navigation}>
					{items.map((item) => (
						<Link
							key={item.title}
							className={styles.navItem}
							data-active={pathname.includes(item.url)}
							title={item.title}
							href={item.url}
							locale={locale}
							onClick={isMobile ? onClose : undefined}
						>
							<item.icon size={20} />
							<span className={styles.navText}>{item.title}</span>
						</Link>
					))}
				</nav>
				 
			</div>
		</>
	);
}
