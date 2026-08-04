import { COLORS } from "../styles/theme";

export default function Badge({

    children,

    variant="primary"

}){

    const color=COLORS[variant];

    return(

        <span

            className={`

            inline-flex

            items-center

            px-4

            py-2

            rounded-full

            text-sm

            font-semibold

            ${color.light}

            ${color.dark}

            `}

        >

            {children}

        </span>

    )

}