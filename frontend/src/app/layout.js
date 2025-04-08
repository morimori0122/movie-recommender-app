import './globals.css'
import { FavoriteProvider } from '../context/FavoriteContext'

export const metadata = {
    title:'Movie App',
    description:'A movie recommender app',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <FavoriteProvider>
                    {children}
                </FavoriteProvider>
            </body>
        </html>
    )
}