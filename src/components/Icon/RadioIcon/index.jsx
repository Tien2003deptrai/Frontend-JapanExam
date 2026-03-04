export default function RadioIcon({ color = '', size = 24, ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color }}
            {...props}
        >
            <rect x="0.625" y="0.625" width="22.75" height="22.75" rx="11.375" strokeWidth="1.25" />
        </svg>
    )
}
