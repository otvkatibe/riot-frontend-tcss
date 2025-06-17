export const HextechIcon = (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="hextechGradientV3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#C89B3C', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#785A28', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path fill="url(#hextechGradientV3)" d="M50,5 L95,27.5 L95,72.5 L50,95 L5,72.5 L5,27.5 Z"></path>
        <path fill="none" stroke="#F0E6D2" strokeWidth="2" d="M50,5 L95,27.5 L95,72.5 L50,95 L5,72.5 L5,27.5 Z"></path>
    </svg>
);