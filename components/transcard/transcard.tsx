import styles from "./transcard.module.css";

export default function TransCard({ amount=0, type="", description="..." }) {
    return (
        <div className={styles.trans_card}>

            <div className="inline-flex w-full items-center justify-between">
                <span className="capitalize">{ description }</span>
                <span className={`${ type === "expense" ? 'text-red-500' : 'text-green-500' } font-bold text-nowrap`}>
                    { type === "expense" ? `- ${amount}` : `+ ${amount}` }
                </span>
            </div>

            <div className="inline-flex w-full">
                <span className="text-xs font-extralight capitalize pb-1">{ type }</span>
            </div>

        </div>
    );
}