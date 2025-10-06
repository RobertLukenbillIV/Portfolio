import 'dotenv/config'         // optional but handy for local .env
import app from './app'        // ✅ default import, no .js

const port = Number(process.env.PORT || 4000)
app.listen(port, () => console.log('API on :' + port))
