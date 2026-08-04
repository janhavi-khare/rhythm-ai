export default function LoadingScreen(){

    return(

        <div className="min-h-screen flex items-center justify-center bg-[#F9F7FC]">

            <div className="text-center">

                <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto"/>

                <h1 className="text-3xl font-bold mt-8">

                    Generating Your Rhythm...

                </h1>

                <p className="text-gray-500 mt-3">

                    Analyzing today's check-in

                </p>

            </div>

        </div>

    )

}