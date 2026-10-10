'use client';
import ExerciseCard from '@/components/icare/ExerciseCard/ExerciseCard';
import ExerciseModal from '@/components/icare/ExerciseModal/ExerciseModal';
import HospitalCard from '@/components/icare/HospitalCard/hospitalCard';
import HospitalModal from '@/components/icare/HospitalModal/HospitalModal';
import ProductCard from '@/components/icare/ProductCard/ProductCard';
import ProductModal from '@/components/icare/ProductModal/ProductModal';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import useTranslationData from '@/hooks/use-translation-data';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { ExerciseCardData, HospitalCardData, ProductCardData } from '@/types';
import { useState } from 'react';
import styles from './IcarePage.module.css';

export default function ICarePage() {
	const { ExerciseData, hospitalsData, productsData, icarePageText } = useTranslationData();

	const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(null);
	const [isProductModalOpen, setIsProductModalOpen] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState<ExerciseCardData | null>(null);
	const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
	const [selectedHospital, setSelectedHospital] = useState<HospitalCardData | null>(null);
	const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

	const { metrics } = useEyeTrackingContext();

	const handleHospitalCardClick = (hospital: HospitalCardData) => {
		setSelectedHospital(hospital);
		setIsHospitalModalOpen(true);
	};

	const handleCloseHospitalModal = () => {
		setIsHospitalModalOpen(false);
		setSelectedHospital(null);
	};

	const handleProductClick = (product: ProductCardData) => {
		setSelectedProduct(product);
		setIsProductModalOpen(true);
	};

	const handleCloseProductModal = () => {
		setIsProductModalOpen(false);
		setSelectedProduct(null);
	};

	const handleExerciseClick = (exercise: ExerciseCardData) => {
		setSelectedExercise(exercise);
		setIsExerciseModalOpen(true);
	};

	const handleCloseExerciseModal = () => {
		setIsExerciseModalOpen(false);
		setSelectedExercise(null);
	};
	return (
		<div className={styles.container}>
			<>
				<TitleHeader title={icarePageText.sectionTitles.eyeExercises} />
				<div className={styles.mainSection}>
					{ExerciseData.map((exercise) => (
						<ExerciseCard
							key={exercise.title}
							title={exercise.title}
							image={exercise.image}
							youtubeUrl={exercise.youtubeUrl}
							description={exercise.description}
							onClick={() => handleExerciseClick(exercise)}
						/>
					))}
				</div>
			</>
			<>
				<TitleHeader title={icarePageText.sectionTitles.eyeProducts} />
				<div className={styles.mainSection}>
					{productsData.map((product) => (
						<ProductCard
							key={product.key}
							title={product.title}
							description={product.description}
							image={product.image}
							price={product.price}
							amazonUrl={product.amazonUrl}
							detailedDescription={product.detailedDescription}
							onClick={() => handleProductClick(product)}
						/>
					))}
				</div>
			</>
			<>
				<TitleHeader title={icarePageText.sectionTitles.eyeSpecialists} />
				<div className={styles.mainSection}>
					{hospitalsData.map((hospital) => (
						<HospitalCard
							key={hospital.title}
							title={hospital.title}
							image={hospital.image}
							onClick={() => handleHospitalCardClick(hospital)}
						/>
					))}
				</div>
			</>

			<ProductModal
				isOpen={isProductModalOpen}
				onClose={handleCloseProductModal}
				product={selectedProduct}
			/>

			<ExerciseModal
				isOpen={isExerciseModalOpen}
				onClose={handleCloseExerciseModal}
				exercise={selectedExercise}
				currentMetrics={metrics}
			/>

			<HospitalModal
				isOpen={isHospitalModalOpen}
				onClose={handleCloseHospitalModal}
				hospital={selectedHospital}
			/>
		</div>
	);
}
