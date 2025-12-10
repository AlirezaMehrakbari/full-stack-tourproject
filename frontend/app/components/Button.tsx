import React, {ImgHTMLAttributes} from "react";


type ButtonProps = {
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean,
    icon?: ImgHTMLAttributes<HTMLImageElement>,
    outline?: boolean
    height?: string,
    styles?: string,
    type?: 'submit',
    className?: string
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           type,
                                           onClick,
                                           disabled,
                                           icon,
                                           outline,
                                           height,
                                           styles,
                                           className,
                                       }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={
                `
                ${className}
                flex 
                items-center
                justify-center
            disabled:opacity-70
            h-[40px]
            ${styles ? `${styles}` : ''}
            ${outline ? 'bg-white' : 'bg-orange'}
            ${outline ? 'text-orange' : 'text-white'}
            ${outline ? 'border-[2px] border-orange' : 'border-transparent'}
            `
            }

        >
            {/*{icon &&*/}
            {/*    <Image*/}
            {/*        src={icon}*/}
            {/*        alt={'icon'}*/}
            {/*    />*/}
            {/*}*/}

            {children}
        </button>
    )
}

export default Button
