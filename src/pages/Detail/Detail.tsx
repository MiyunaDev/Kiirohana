import { useEffect, useState } from "react"
import { useSearchParams } from 'react-router';
import { motion } from "framer-motion";

const library: [] = []

const Detail = () => {
    const [searchParams] = useSearchParams();

    const [detail, setDetail] = useState<any>(null);

    useEffect(() => {
        const title = searchParams.get('title');

        const info: any = library.find((x: any) => x.title === title);
        setDetail(info);
    }, [searchParams.toString()]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen text-white overflow-x-hidden"
        >

            <div className="w-full flex flex-col md:grid md:grid-cols-2">
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full aspect-[16/5] relative z-0"
                    >

                        <img
                            className="w-full h-full object-cover"
                            src={detail?.cover}
                            alt="cover background"
                        />
                        <div className="absolute inset-0 backdrop-blur-lg" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="w-full px-4 -mt-8 flex items-start gap-4 relative z-10"
                    >

                        <img
                            className="aspect-[2/3] w-32 sm:w-40 object-cover bg-gray-300 rounded-md shadow-lg"
                            src={detail?.cover}
                            alt={detail?.title}
                        />
                        <div className="flex flex-col mt-8 justify-end pb-2">
                            <h1 className="text-xl sm:text-2xl font-semibold">{detail?.title}</h1>
                            <p className="text-sm opacity-70">Unknown</p>
                            <p className="text-sm">{detail?.author?.join(", ")}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="px-4 py-6 md:px-8 md:py-6 text-sm md:text-base leading-relaxed"
                    >
                        {detail?.synopsis}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, translateX: -100 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 0.55 }}

                        className="p-2 flex flex-row overflow-y-auto items-center"
                    >
                        {detail?.genres?.map((gen: any) =>
                            <div
                                className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1"
                            >
                                {gen}
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="relative w-full overflow-hidden p-4 gap-2">
                </div>
            </div>
        </motion.div>
    );
};

export default Detail;