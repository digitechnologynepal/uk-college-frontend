export const Button = ({ className, children }) => {
    return (
        <button type="submit" className={className ? `${className}` : "btn-primary"}>{children}</button>
    )
}