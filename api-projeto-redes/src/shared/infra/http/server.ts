import { app } from './app'

const port: number = parseInt(process.env.PORT ?? '3333', 10)

app.listen(port, "0.0.0.0", () => console.log(`Server is running on port ${port}`))