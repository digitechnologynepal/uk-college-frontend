import { Construction } from "lucide-react"

export const UnderConstruction = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
            <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary p-4">
                        <Construction className="h-12 w-12 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Under Construction</h1>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                    We're working hard to bring you something amazing. Our website is currently under construction.
                </p>
            </div>
        </div>
    )
}