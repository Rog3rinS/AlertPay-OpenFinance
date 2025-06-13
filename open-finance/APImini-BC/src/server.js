import { initDefaultBank } from './config/initBank.js';
import app from './app.js';

await initDefaultBank();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
