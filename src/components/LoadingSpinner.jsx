/** @format */

export const LoadingSpinner = ({ size = 'normal' }) => (
	<div className='flex justify-center items-center py-4'>
		<div className={size === 'small' ? 'small-loader' : 'loader'}></div>
	</div>
);