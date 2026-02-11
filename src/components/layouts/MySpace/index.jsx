const MySpace = ({ children }) => {
    return <div className="flex h-full w-full flex-col">{children}</div>
}

const Heading = ({ children, className = '', ...props }) => {
    return (
        <div className={`${className}`} {...props}>
            {children}
        </div>
    )
}

const Body = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex-1 bg-[#f6f6f6] p-5 ${className}`} {...props}>
            {children}
        </div>
    )
}

MySpace.Heading = Heading
MySpace.Body = Body
export default MySpace
