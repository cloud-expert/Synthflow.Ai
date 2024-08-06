const Button = ({text, handleClick}) => {
    return(
        <div className="bg-[#19A5F3] rounded-3xl text-white w-full py-2 
            cursor-pointer select-none text-[18px]" onClick={handleClick}>
            { text }
        </div>
    )
}

export default Button;